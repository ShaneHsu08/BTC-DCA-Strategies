export type InvestmentFrequency = 'daily' | 'weekly' | 'monthly';

export interface PriceDataPoint {
    date: string;
    close: number;
    rsi?: number;
}

export interface SimulationParams {
    selectedAsset: string;
    frequency: InvestmentFrequency;
    baseBudget: number;
    startDate: string;
    endDate: string;

    // Dynamic DCA
    rsiExtremeLow: number;
    budgetExtremeLow: number;
    rsiLow: number;
    budgetLow: number;
    rsiHigh: number;
    budgetHigh: number;
    rsiExtremeHigh: number;
    budgetExtremeHigh: number;

    // Value Averaging
    vaMaxBuyCap: number;
    vaMaxSellCap: number;
    vaPeriodGrowth: number;
}

export interface TimeSeriesPoint {
    date: string;
    price: number;
    assetAccumulated: number;
    portfolioValue: number;
    averageCostBasis: number;
    usdInvested: number;
    periodInvestment: number;
}

export interface Metrics {
    totalUsdInvested: number;
    totalAssetAccumulated: number;
    finalPortfolioValue: number;
    averageCostBasis: number;
    roiPercentage: number;
    maxDrawdown: number;
    sharpeRatio: number;
}

export interface StrategyResult {
    strategyName: string;
    metrics: Metrics;
    timeSeries: TimeSeriesPoint[];
}
