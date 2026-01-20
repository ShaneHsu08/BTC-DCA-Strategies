//! Historical Price Data API Server
//!
//! Serves price data from SQLite database via HTTP.
//! Endpoint: GET /api/history/:symbol

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::get,
    Router,
};
use rusqlite::Connection;
use serde::Serialize;
use std::path::PathBuf;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;

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
        "BTC", "ETH", "BNB", "SOL", "XRP", "LTC",
        // Global Equity
        "VWRA", "IWDA", "VT",
        // Regional Equity
        "CSPX", "VTI", "EXSA", "VWO",
        // Fixed Income (Bonds)
        "BND", "EMB",
        // Commodities
        "GLD", "DBC",
        // Real Estate (REITs)
        "VNQ",
        // Thematic & Sector
        "QQQ", "ICLN", "VHYL",
    ];
    let symbol_upper = symbol.to_uppercase();

    if !valid_symbols.contains(&symbol_upper.as_str()) {
        return Err((
            StatusCode::BAD_REQUEST,
            format!("Invalid symbol: {}. Valid symbols: {:?}", symbol, valid_symbols),
        ));
    }

    // Open database connection
    let conn = Connection::open(&state.db_path).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Database error: {}", e),
        )
    })?;

    // Query price data
    let mut stmt = conn
        .prepare("SELECT date, close, rsi FROM price_data WHERE symbol = ? ORDER BY date ASC")
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Query error: {}", e),
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
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Query execution error: {}", e),
            )
        })?;

    let data: Vec<PriceDataPoint> = rows
        .filter_map(|r| r.ok())
        .collect();

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

    // Database path (relative to where the server is run from)
    let db_path = PathBuf::from("../collector/data.db");

    if !db_path.exists() {
        eprintln!("Error: Database not found at {:?}", db_path);
        eprintln!("Please run the Python collector first: cd ../collector && python collector.py --full");
        std::process::exit(1);
    }

    let state = Arc::new(AppState { db_path });

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Build router
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/history/{symbol}", get(get_history))
        .layer(cors)
        .with_state(state);

    let addr = "0.0.0.0:3001";
    info!("Starting API server on {}", addr);
    println!("🚀 API server running at http://localhost:3001");
    println!("   Health check: http://localhost:3001/health");
    println!("   Example: http://localhost:3001/api/history/BTC");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
