export interface PriceDataPoint {
    date: string;
    close: number;
    rsi: number;
}

export interface SimulationParams {
    weeklyBudget: number;
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
    vaWeeklyGrowth: number;
}

export interface TimeSeriesPoint {
    date: string;
    price: number;
    btcAccumulated: number;
    portfolioValue: number;
    averageCostBasis: number;
    usdInvested: number;
    weeklyInvestment: number;
}

export interface Metrics {
    totalUsdInvested: number;
    totalBtcAccumulated: number;
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