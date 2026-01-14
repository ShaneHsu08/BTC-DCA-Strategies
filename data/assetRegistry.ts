import type { PriceDataPoint } from '../types';

/**
 * Asset definition for all supported investable assets
 */
export interface AssetDefinition {
    id: string;
    name: string;
    code: string;
    category: 'crypto' | 'equity' | 'bond' | 'commodity' | 'reit' | 'thematic';
    unit: string;
    hasRsi: boolean;
    description: string;
}

/**
 * Registry of all available assets for DCA simulation
 */
export const assetRegistry: AssetDefinition[] = [
    // Crypto
    {
        id: 'BTC',
        name: 'Bitcoin',
        code: 'BTC',
        category: 'crypto',
        unit: 'BTC',
        hasRsi: true,
        description: 'The original cryptocurrency and digital gold.',
    },
    // Global Equity
    {
        id: 'VWRA',
        name: 'Vanguard FTSE All-World UCITS ETF',
        code: 'VWRA',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Tracks ~4000 stocks across 50+ countries (Developed + EM).',
    },
    {
        id: 'CSPX',
        name: 'iShares Core S&P 500 UCITS ETF',
        code: 'CSPX',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Tracks the S&P 500 Index - 500 largest US companies.',
    },
    {
        id: 'VT',
        name: 'Vanguard Total World Stock ETF',
        code: 'VT',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Global equity covering ~9000 stocks worldwide.',
    },
    // Commodities
    {
        id: 'GLD',
        name: 'SPDR Gold Shares',
        code: 'GLD',
        category: 'commodity',
        unit: 'shares',
        hasRsi: true,
        description: 'Physical gold ETF - tracks gold spot price.',
    },
    // Thematic
    {
        id: 'QQQ',
        name: 'Invesco QQQ Trust',
        code: 'QQQ',
        category: 'thematic',
        unit: 'shares',
        hasRsi: true,
        description: 'Nasdaq-100 Index - tech-heavy large-cap growth.',
    },
];

/**
 * Get asset definition by ID
 */
export const getAssetById = (id: string): AssetDefinition | undefined => {
    return assetRegistry.find(asset => asset.id === id);
};

/**
 * Get assets grouped by category
 */
export const getAssetsByCategory = (): Record<string, AssetDefinition[]> => {
    return assetRegistry.reduce((acc, asset) => {
        if (!acc[asset.category]) {
            acc[asset.category] = [];
        }
        acc[asset.category].push(asset);
        return acc;
    }, {} as Record<string, AssetDefinition[]>);
};

/**
 * Category display names for UI
 */
export const categoryNames: Record<string, string> = {
    crypto: 'Cryptocurrency',
    equity: 'Global Equity',
    bond: 'Fixed Income',
    commodity: 'Commodities',
    reit: 'Real Estate',
    thematic: 'Thematic & Sector',
};
