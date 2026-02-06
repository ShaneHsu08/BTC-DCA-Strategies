//! Historical Price Data API Server
//!
//! Serves price data from SQLite database via HTTP.
//! Endpoint: GET /api/history/:symbol

use axum::{
    Router,
    extract::{Path, State},
    http::{
        HeaderValue, Method, StatusCode,
        header::{ACCEPT, CONTENT_TYPE},
    },
    response::Json,
    routing::get,
};
use rusqlite::Connection;
use serde::Serialize;
use std::sync::Arc;
use std::{env, path::PathBuf};
use tower_http::cors::CorsLayer;
use tracing::{error, info, warn};

/// Price data point returned by the API
#[derive(Debug, Serialize)]
struct PriceDataPoint {
    date: String,
    close: f64,
    rsi: Option<f64>,
}

/// Application state holding the database connection
struct AppState {
    db_path: PathBuf,
}

fn parse_allowed_origins() -> Vec<HeaderValue> {
    let default_origins = "http://localhost:3000,http://127.0.0.1:3000,https://dca.btc.sv";
    let raw_origins = env::var("ALLOWED_ORIGINS").unwrap_or_else(|_| default_origins.to_string());

    raw_origins
        .split(',')
        .filter_map(|origin| {
            let trimmed = origin.trim();
            if trimmed.is_empty() {
                return None;
            }

            match HeaderValue::from_str(trimmed) {
                Ok(value) => Some(value),
                Err(e) => {
                    warn!(
                        "Ignoring invalid ALLOWED_ORIGINS entry '{}': {}",
                        trimmed, e
                    );
                    None
                }
            }
        })
        .collect()
}

/// Health check endpoint
async fn health() -> &'static str {
    "OK"
}

/// Get historical price data for a symbol
async fn get_history(
    Path(symbol): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<PriceDataPoint>>, (StatusCode, String)> {
    // Validate symbol
    let valid_symbols = [
        // Crypto
        "BTC", "ETH", "BNB", "SOL", "XRP", "LTC", // Global Equity
        "VWRA", "IWDA", "VT", // Regional Equity
        "CSPX", "VTI", "EXSA", "VWO", // Fixed Income (Bonds)
        "BND", "EMB", // Commodities
        "GLD", "DBC", // Real Estate (REITs)
        "VNQ", // Thematic & Sector
        "QQQ", "ICLN", "VHYL",
    ];
    let symbol_upper = symbol.to_uppercase();

    if !valid_symbols.contains(&symbol_upper.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            format!("Invalid symbol: {}", symbol),
        ));
    }

    // Open database connection
    let conn = Connection::open(&state.db_path).map_err(|e| {
        error!("Database open error ({}): {}", state.db_path.display(), e);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Internal server error".to_string(),
        )
    })?;

    // Query price data
    let mut stmt = conn
        .prepare("SELECT date, close, rsi FROM price_data WHERE symbol = ? ORDER BY date ASC")
        .map_err(|e| {
            error!("Database prepare error for {}: {}", symbol_upper, e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            )
        })?;

    let rows = stmt
        .query_map([&symbol_upper], |row| {
            Ok(PriceDataPoint {
                date: row.get(0)?,
                close: row.get(1)?,
                rsi: row.get(2)?,
            })
        })
        .map_err(|e| {
            error!("Database query error for {}: {}", symbol_upper, e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            )
        })?;

    let mut data = Vec::new();
    for row in rows {
        match row {
            Ok(point) => data.push(point),
            Err(e) => {
                error!("Row decode error for {}: {}", symbol_upper, e);
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Internal server error".to_string(),
                ));
            }
        }
    }

    if data.is_empty() {
        return Err((
            StatusCode::NOT_FOUND,
            format!("No data found for symbol: {}", symbol_upper),
        ));
    }

    info!("Returning {} records for {}", data.len(), symbol_upper);
    Ok(Json(data))
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Database path can be overridden for deployments/tests.
    let default_db_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../collector/data.db");
    let db_path = env::var("DB_PATH")
        .map(PathBuf::from)
        .unwrap_or(default_db_path);

    if !db_path.exists() {
        error!("Database not found at {}", db_path.display());
        error!("Run collector: cd ../collector && python collector.py --full");
        std::process::exit(1);
    }

    let state = Arc::new(AppState { db_path });

    // CORS configuration
    let allowed_origins = parse_allowed_origins();
    if allowed_origins.is_empty() {
        warn!("No valid CORS origins configured via ALLOWED_ORIGINS");
    }
    let cors = CorsLayer::new()
        .allow_origin(allowed_origins)
        .allow_methods([Method::GET, Method::OPTIONS])
        .allow_headers([ACCEPT, CONTENT_TYPE]);

    // Build router
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/history/{symbol}", get(get_history))
        .layer(cors)
        .with_state(state);

    let bind_addr = env::var("BIND_ADDR").unwrap_or_else(|_| "127.0.0.1:3001".to_string());
    info!("Starting API server on {}", bind_addr);

    let listener = match tokio::net::TcpListener::bind(&bind_addr).await {
        Ok(listener) => listener,
        Err(e) => {
            error!("Failed to bind {}: {}", bind_addr, e);
            std::process::exit(1);
        }
    };

    if let Err(e) = axum::serve(listener, app).await {
        error!("API server error: {}", e);
        std::process::exit(1);
    }
}
