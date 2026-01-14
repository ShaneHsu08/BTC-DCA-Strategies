import type { SimulationParams, PriceDataPoint, StrategyResult, Metrics, TimeSeriesPoint, InvestmentFrequency } from '../types';

/**
 * Sample price data based on investment frequency
 * - Daily: Use every data point (assuming weekly data, interpolate to daily-like granularity)
 * - Weekly: Use data as-is
 * - Monthly: Sample approximately every 4 weeks
 */
const samplePriceData = (priceData: PriceDataPoint[], frequency: InvestmentFrequency): PriceDataPoint[] => {
    switch (frequency) {
        case 'daily':
            // Since source data is weekly, we'll use every data point to simulate more frequent investments
            // In a real app, you'd have actual daily data
            return priceData;
        case 'weekly':
            return priceData;
        case 'monthly':
            // Sample every ~4 weeks for monthly investments
            return priceData.filter((_, index) => index % 4 === 0);
        default:
            return priceData;
    }
};

/**
 * Get the annualization factor for Sharpe ratio based on frequency
 */
const getAnnualizationFactor = (frequency: InvestmentFrequency): number => {
    switch (frequency) {
        case 'daily':
            return Math.sqrt(365);
        case 'weekly':
            return Math.sqrt(52);
        case 'monthly':
            return Math.sqrt(12);
        default:
            return Math.sqrt(52);
    }
};

const calculateMetrics = (timeSeries: TimeSeriesPoint[], frequency: InvestmentFrequency): Metrics => {
    if (timeSeries.length < 2) {
        return {
            totalUsdInvested: 0,
            totalAssetAccumulated: 0,
            finalPortfolioValue: 0,
            averageCostBasis: 0,
            roiPercentage: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
        };
    }

    const lastPoint = timeSeries[timeSeries.length - 1];
    const totalUsdInvested = lastPoint.usdInvested;
    const finalPortfolioValue = lastPoint.portfolioValue;

    let peakPortfolioValue = 0;
    let maxDrawdown = 0;

    for (const point of timeSeries) {
        if (point.portfolioValue > peakPortfolioValue) {
            peakPortfolioValue = point.portfolioValue;
        }
        const drawdown = peakPortfolioValue > 0 ? (peakPortfolioValue - point.portfolioValue) / peakPortfolioValue : 0;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    const roi = totalUsdInvested > 0 ? ((finalPortfolioValue - totalUsdInvested) / totalUsdInvested) * 100 : 0;

    // Calculate Sharpe Ratio
    const periodReturns: number[] = [];
    for (let i = 1; i < timeSeries.length; i++) {
        const previousValue = timeSeries[i - 1].portfolioValue;
        if (previousValue > 0) {
            const periodReturn = (timeSeries[i].portfolioValue - previousValue) / previousValue;
            periodReturns.push(periodReturn);
        } else {
            periodReturns.push(0);
        }
    }

    let sharpeRatio = 0;
    if (periodReturns.length > 1) {
        const meanReturn = periodReturns.reduce((acc, val) => acc + val, 0) / periodReturns.length;

        // 使用样本标准差（除以n-1而不是n）
        const variance = periodReturns
            .map(x => Math.pow(x - meanReturn, 2))
            .reduce((a, b) => a + b) / (periodReturns.length - 1);
        const stdDev = Math.sqrt(variance);

        if (stdDev > 0) {
            // 假设风险无风险利率为0（对于加密货币投资是合理的简化）
            const periodSharpe = meanReturn / stdDev;
            // 年化夏普比率 based on frequency
            sharpeRatio = periodSharpe * getAnnualizationFactor(frequency);
        }
    }


    return {
        totalUsdInvested,
        totalAssetAccumulated: lastPoint.assetAccumulated,
        finalPortfolioValue,
        averageCostBasis: lastPoint.averageCostBasis,
        roiPercentage: roi,
        maxDrawdown: maxDrawdown * 100,
        sharpeRatio,
    };
};

const runStandardDCA = (params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult => {
    let assetAccumulated = 0;
    let usdInvested = 0;
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        const investment = params.baseBudget;
        usdInvested += investment;
        assetAccumulated += investment / point.close;

        const portfolioValue = assetAccumulated * point.close;
        const averageCostBasis = usdInvested > 0 && assetAccumulated > 0 ? usdInvested / assetAccumulated : 0;

        timeSeries.push({
            date: point.date,
            price: point.close,
            assetAccumulated,
            portfolioValue,
            averageCostBasis,
            usdInvested,
            periodInvestment: investment,
        });
    }

    return {
        strategyName: 'standardDca',
        timeSeries,
        metrics: calculateMetrics(timeSeries, params.frequency),
    };
};

const runDynamicDCA = (params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult => {
    let assetAccumulated = 0;
    let usdInvested = 0;
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        let investment = params.baseBudget;
        if (point.rsi <= params.rsiExtremeLow) {
            investment = params.budgetExtremeLow;
        } else if (point.rsi <= params.rsiLow) {
            investment = params.budgetLow;
        } else if (point.rsi >= params.rsiExtremeHigh) {
            investment = params.budgetExtremeHigh;
        } else if (point.rsi >= params.rsiHigh) {
            investment = params.budgetHigh;
        }

        usdInvested += investment;
        assetAccumulated += investment / point.close;

        const portfolioValue = assetAccumulated * point.close;
        const averageCostBasis = usdInvested > 0 && assetAccumulated > 0 ? usdInvested / assetAccumulated : 0;

        timeSeries.push({
            date: point.date,
            price: point.close,
            assetAccumulated,
            portfolioValue,
            averageCostBasis,
            usdInvested,
            periodInvestment: investment,
        });
    }

    return {
        strategyName: 'dynamicDca',
        timeSeries,
        metrics: calculateMetrics(timeSeries, params.frequency),
    };
};

const runValueAveraging = (params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult => {
    let assetAccumulated = 0;
    let usdInvested = 0;
    let targetValue = 0;
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        targetValue += params.vaPeriodGrowth;
        const currentPortfolioValue = assetAccumulated * point.close;
        let investment = targetValue - currentPortfolioValue;

        // Apply caps
        if (investment > 0) { // Buying
            investment = Math.min(investment, params.vaMaxBuyCap);
        } else { // Selling
            investment = Math.max(investment, -params.vaMaxSellCap);
        }

        usdInvested += investment;
        assetAccumulated += investment / point.close;

        if (assetAccumulated < 0) assetAccumulated = 0; // Can't have negative assets

        const portfolioValue = assetAccumulated * point.close;
        const averageCostBasis = usdInvested > 0 && assetAccumulated > 0 ? usdInvested / assetAccumulated : 0;

        timeSeries.push({
            date: point.date,
            price: point.close,
            assetAccumulated,
            portfolioValue,
            averageCostBasis,
            usdInvested,
            periodInvestment: investment,
        });
    }

    return {
        strategyName: 'valueAveraging',
        timeSeries,
        metrics: calculateMetrics(timeSeries, params.frequency),
    };
}


export const runSimulation = (params: SimulationParams, allPriceData: PriceDataPoint[]): StrategyResult[] => {
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    // First filter by date range
    const filteredPriceData = allPriceData.filter(point => {
        const pointDate = new Date(point.date);
        return pointDate >= startDate && pointDate <= endDate;
    });

    // Then sample based on frequency
    const sampledPriceData = samplePriceData(filteredPriceData, params.frequency);

    if (sampledPriceData.length < 2) {
        throw new Error("Not enough data for the selected date range. Please select a wider range.");
    }

    const standardDcaResult = runStandardDCA(params, sampledPriceData);
    const dynamicDcaResult = runDynamicDCA(params, sampledPriceData);
    const valueAveragingResult = runValueAveraging(params, sampledPriceData);

    return [standardDcaResult, dynamicDcaResult, valueAveragingResult];
};