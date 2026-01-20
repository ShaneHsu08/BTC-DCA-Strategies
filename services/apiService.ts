import type { PriceDataPoint } from '../types';

/**
 * Fetches historical price data from the API server.
 *
 * @param assetId - The asset identifier (e.g., 'BTC', 'VWRA')
 * @returns Promise resolving to array of price data points
 */
export async function fetchPriceData(assetId: string): Promise<PriceDataPoint[]> {
    const response = await fetch(`/api/history/${assetId}`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch price data for ${assetId}: ${errorText}`);
    }

    const data = await response.json();

    // Ensure RSI is undefined (not null) for consistency with frontend types
    return data.map((point: { date: string; close: number; rsi: number | null }) => ({
        date: point.date,
        close: point.close,
        rsi: point.rsi ?? undefined,
    }));
}
