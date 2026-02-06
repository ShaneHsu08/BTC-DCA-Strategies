import type { PriceDataPoint } from '../types';

const ASSET_ID_PATTERN = /^[A-Z0-9.-]{1,16}$/;

function isValidDateString(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return Number.isFinite(Date.parse(`${value}T00:00:00Z`));
}

function isPositiveFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function sanitizeAssetId(assetId: string): string {
    const normalized = assetId.trim().toUpperCase();
    if (!ASSET_ID_PATTERN.test(normalized)) {
        throw new Error('Invalid asset identifier.');
    }
    return normalized;
}

/**
 * Fetches historical price data from the API server.
 *
 * @param assetId - The asset identifier (e.g., 'BTC', 'VWRA')
 * @returns Promise resolving to array of price data points
 */
export async function fetchPriceData(assetId: string): Promise<PriceDataPoint[]> {
    const sanitizedAssetId = sanitizeAssetId(assetId);
    const response = await fetch(`/api/history/${encodeURIComponent(sanitizedAssetId)}`, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch price data for ${sanitizedAssetId}: ${errorText}`);
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
        throw new Error('Invalid response format from API.');
    }

    const parsed = payload
        .map((point): PriceDataPoint | null => {
            if (typeof point !== 'object' || point === null) return null;

            const rawDate = (point as Record<string, unknown>).date;
            const rawClose = (point as Record<string, unknown>).close;
            const rawRsi = (point as Record<string, unknown>).rsi;

            if (!isValidDateString(rawDate) || !isPositiveFiniteNumber(rawClose)) {
                return null;
            }

            return {
                date: rawDate,
                close: rawClose,
                rsi: typeof rawRsi === 'number' && Number.isFinite(rawRsi) ? rawRsi : undefined,
            };
        })
        .filter((point): point is PriceDataPoint => point !== null);

    if (parsed.length === 0) {
        throw new Error(`No valid price data returned for ${sanitizedAssetId}.`);
    }

    return parsed;
}
