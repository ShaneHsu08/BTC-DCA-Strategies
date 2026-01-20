#!/usr/bin/env python3
"""
Historical Price Data Collector

Fetches historical price data from Yahoo Finance and stores it in SQLite.
Run this script daily (manually or via cron) to keep data up-to-date.

Usage:
    python collector.py [--full]  # --full to fetch all history, otherwise incremental
"""

import argparse
import sqlite3
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import yfinance as yf

# Asset ID to Yahoo Finance symbol mapping
ASSET_SYMBOLS = {
    # Crypto
    "BTC": "BTC-USD",
    "ETH": "ETH-USD",
    "BNB": "BNB-USD",
    "SOL": "SOL-USD",
    "XRP": "XRP-USD",
    "LTC": "LTC-USD",
    # Global Equity
    "VWRA": "VWRA.L",
    "IWDA": "IWDA.L",
    "VT": "VT",
    # Regional Equity
    "CSPX": "CSPX.L",
    "VTI": "VTI",
    "EXSA": "EXSA.DE",
    "VWO": "VWO",
    # Fixed Income (Bonds)
    "BND": "BND",
    "EMB": "EMB",
    # Commodities
    "GLD": "GLD",
    "DBC": "DBC",
    # Real Estate (REITs)
    "VNQ": "VNQ",
    # Thematic & Sector
    "QQQ": "QQQ",
    "ICLN": "ICLN",
    "VHYL": "VHYL.L",
}

# Database path (same directory as this script)
DB_PATH = Path(__file__).parent / "data.db"


def calculate_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
    """Calculate Relative Strength Index (RSI)."""
    delta = prices.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = (-delta).where(delta < 0, 0.0)

    avg_gain = gain.rolling(window=period, min_periods=period).mean()
    avg_loss = loss.rolling(window=period, min_periods=period).mean()

    # Use Wilder's smoothing for subsequent values
    for i in range(period, len(avg_gain)):
        avg_gain.iloc[i] = (avg_gain.iloc[i - 1] * (period - 1) + gain.iloc[i]) / period
        avg_loss.iloc[i] = (avg_loss.iloc[i - 1] * (period - 1) + loss.iloc[i]) / period

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi


def init_db(conn: sqlite3.Connection) -> None:
    """Initialize the database schema."""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS price_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            symbol TEXT NOT NULL,
            date TEXT NOT NULL,
            close REAL NOT NULL,
            rsi REAL,
            UNIQUE(symbol, date)
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_symbol_date ON price_data(symbol, date)")
    conn.commit()


def get_last_date(conn: sqlite3.Connection, symbol: str) -> str | None:
    """Get the last date we have data for a symbol."""
    cursor = conn.execute(
        "SELECT MAX(date) FROM price_data WHERE symbol = ?", (symbol,)
    )
    result = cursor.fetchone()[0]
    return result


def fetch_and_store(
    conn: sqlite3.Connection, asset_id: str, yahoo_symbol: str, start_date: str
) -> int:
    """Fetch data from Yahoo Finance and store in SQLite. Returns count of new rows."""
    print(f"Fetching {asset_id} ({yahoo_symbol}) from {start_date}...")

    ticker = yf.Ticker(yahoo_symbol)
    df = ticker.history(start=start_date, interval="1d")

    if df.empty:
        print(f"  No new data for {asset_id}")
        return 0

    # Calculate RSI
    df["RSI"] = calculate_rsi(df["Close"])

    # Prepare data for insertion
    rows = []
    for date, row in df.iterrows():
        date_str = date.strftime("%Y-%m-%d")
        close = float(row["Close"])
        rsi = float(row["RSI"]) if pd.notna(row["RSI"]) else None
        rows.append((asset_id, date_str, close, rsi))

    # Insert with conflict resolution (update if exists)
    conn.executemany(
        """
        INSERT INTO price_data (symbol, date, close, rsi)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(symbol, date) DO UPDATE SET
            close = excluded.close,
            rsi = excluded.rsi
        """,
        rows,
    )
    conn.commit()

    print(f"  Stored {len(rows)} records for {asset_id}")
    return len(rows)


def main():
    parser = argparse.ArgumentParser(description="Fetch historical price data")
    parser.add_argument(
        "--full",
        action="store_true",
        help="Fetch full history (from 2015-01-01) instead of incremental",
    )
    args = parser.parse_args()

    print(f"Database: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    init_db(conn)

    total_rows = 0

    for asset_id, yahoo_symbol in ASSET_SYMBOLS.items():
        if args.full:
            start_date = "2015-01-01"
        else:
            last_date = get_last_date(conn, asset_id)
            if last_date:
                # Start from the day after the last date we have
                last_dt = datetime.strptime(last_date, "%Y-%m-%d")
                start_date = (last_dt + timedelta(days=1)).strftime("%Y-%m-%d")
            else:
                # No data yet, fetch from 2015
                start_date = "2015-01-01"

        try:
            count = fetch_and_store(conn, asset_id, yahoo_symbol, start_date)
            total_rows += count
        except Exception as e:
            print(f"  Error fetching {asset_id}: {e}")

    conn.close()
    print(f"\nDone! Total records processed: {total_rows}")


if __name__ == "__main__":
    main()
