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
    {
        id: 'ETH',
        name: 'Ethereum',
        code: 'ETH',
        category: 'crypto',
        unit: 'ETH',
        hasRsi: true,
        description: 'Smart contract platform, second-largest cryptocurrency.',
    },
    {
        id: 'BNB',
        name: 'BNB',
        code: 'BNB',
        category: 'crypto',
        unit: 'BNB',
        hasRsi: true,
        description: 'Binance ecosystem token, used for trading fees and DeFi.',
    },
    {
        id: 'SOL',
        name: 'Solana',
        code: 'SOL',
        category: 'crypto',
        unit: 'SOL',
        hasRsi: true,
        description: 'High-performance blockchain for DeFi and NFTs.',
    },
    {
        id: 'XRP',
        name: 'XRP',
        code: 'XRP',
        category: 'crypto',
        unit: 'XRP',
        hasRsi: true,
        description: 'Digital payment protocol for fast cross-border transactions.',
    },
    {
        id: 'LTC',
        name: 'Litecoin',
        code: 'LTC',
        category: 'crypto',
        unit: 'LTC',
        hasRsi: true,
        description: 'Silver to Bitcoin\'s gold, faster transaction times.',
    },
    // Global Equity
    {
        id: 'VWRA',
        name: 'Vanguard FTSE All-World UCITS ETF',
        code: 'VWRA',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Tracks ~4000 stocks across 50+ countries (Developed + EM). TER: 0.22%',
    },
    {
        id: 'IWDA',
        name: 'iShares Core MSCI World UCITS ETF',
        code: 'IWDA',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Tracks MSCI World Index - ~1500 stocks in developed markets. TER: 0.20%',
    },
    {
        id: 'VT',
        name: 'Vanguard Total World Stock ETF',
        code: 'VT',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Global equity covering ~9000 stocks worldwide. TER: 0.07%',
    },
    {
        id: 'CSPX',
        name: 'iShares Core S&P 500 UCITS ETF',
        code: 'CSPX',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Tracks the S&P 500 Index - 500 largest US companies. TER: 0.07%',
    },
    {
        id: 'VTI',
        name: 'Vanguard Total Stock Market ETF',
        code: 'VTI',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'U.S. Total Market - ~4000 stocks (large, mid, small caps). TER: 0.03%',
    },
    {
        id: 'EXSA',
        name: 'iShares STOXX Europe 600 UCITS ETF',
        code: 'EXSA',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: '600 largest European companies across 17 markets. TER: 0.20%',
    },
    {
        id: 'VWO',
        name: 'Vanguard FTSE Emerging Markets ETF',
        code: 'VWO',
        category: 'equity',
        unit: 'shares',
        hasRsi: true,
        description: 'Emerging Markets - China, India, Brazil, Taiwan, etc. TER: 0.08%',
    },
    // Fixed Income (Bonds)
    {
        id: 'BND',
        name: 'Vanguard Total Bond Market ETF',
        code: 'BND',
        category: 'bond',
        unit: 'shares',
        hasRsi: true,
        description: 'U.S. Investment-Grade Bonds - Treasuries, Corporate, MBS. TER: 0.03%',
    },
    {
        id: 'EMB',
        name: 'iShares J.P. Morgan USD EM Bond ETF',
        code: 'EMB',
        category: 'bond',
        unit: 'shares',
        hasRsi: true,
        description: 'Emerging Markets Sovereign Bonds (USD-denominated). TER: 0.39%',
    },
    // Commodities
    {
        id: 'GLD',
        name: 'SPDR Gold Shares',
        code: 'GLD',
        category: 'commodity',
        unit: 'shares',
        hasRsi: true,
        description: 'Physical gold ETF - tracks gold spot price. TER: 0.40%',
    },
    {
        id: 'DBC',
        name: 'Invesco DB Commodity Index Tracking Fund',
        code: 'DBC',
        category: 'commodity',
        unit: 'shares',
        hasRsi: true,
        description: 'Broad commodity basket - oil, gas, gold, corn, etc. TER: 0.85%',
    },
    // Real Estate (REITs)
    {
        id: 'VNQ',
        name: 'Vanguard Real Estate ETF',
        code: 'VNQ',
        category: 'reit',
        unit: 'shares',
        hasRsi: true,
        description: 'U.S. REITs - retail, residential, office, infrastructure. TER: 0.13%',
    },
    // Thematic & Sector
    {
        id: 'QQQ',
        name: 'Invesco QQQ Trust',
        code: 'QQQ',
        category: 'thematic',
        unit: 'shares',
        hasRsi: true,
        description: 'Nasdaq-100 Index - tech-heavy large-cap growth. TER: 0.20%',
    },
    {
        id: 'ICLN',
        name: 'iShares Global Clean Energy ETF',
        code: 'ICLN',
        category: 'thematic',
        unit: 'shares',
        hasRsi: true,
        description: 'Clean Energy - solar, wind, hydro companies globally. TER: 0.39%',
    },
    {
        id: 'VHYL',
        name: 'Vanguard FTSE All-World High Dividend Yield ETF',
        code: 'VHYL',
        category: 'thematic',
        unit: 'shares',
        hasRsi: true,
        description: 'Global high-dividend stocks - ~1500 stocks. TER: 0.29%',
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
