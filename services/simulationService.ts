import type { SimulationParams, PriceDataPoint, StrategyResult, Metrics, TimeSeriesPoint } from '../types';

const calculateMetrics = (timeSeries: TimeSeriesPoint[]): Metrics => {
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
    const weeklyReturns: number[] = [];
    for (let i = 1; i < timeSeries.length; i++) {
        const previousValue = timeSeries[i - 1].portfolioValue;
        if (previousValue > 0) {
            const weeklyReturn = (timeSeries[i].portfolioValue - previousValue) / previousValue;
            weeklyReturns.push(weeklyReturn);
        } else {
            weeklyReturns.push(0);
        }
    }

    let sharpeRatio = 0;
    if (weeklyReturns.length > 1) {
        const meanReturn = weeklyReturns.reduce((acc, val) => acc + val, 0) / weeklyReturns.length;

        // 使用样本标准差（除以n-1而不是n）
        const variance = weeklyReturns
            .map(x => Math.pow(x - meanReturn, 2))
            .reduce((a, b) => a + b) / (weeklyReturns.length - 1);
        const stdDev = Math.sqrt(variance);

        if (stdDev > 0) {
            // 假设风险无风险利率为0（对于加密货币投资是合理的简化）
            const weeklySharpe = meanReturn / stdDev;
            // 年化夏普比率：周夏普比率 × √52
            sharpeRatio = weeklySharpe * Math.sqrt(52);
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
        const investment = params.weeklyBudget;
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
            weeklyInvestment: investment,
        });
    }

    return {
        strategyName: 'standardDca',
        timeSeries,
        metrics: calculateMetrics(timeSeries),
    };
};

const runDynamicDCA = (params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult => {
    let assetAccumulated = 0;
    let usdInvested = 0;
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        let investment = params.weeklyBudget;
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
            weeklyInvestment: investment,
        });
    }

    return {
        strategyName: 'dynamicDca',
        timeSeries,
        metrics: calculateMetrics(timeSeries),
    };
};

const runValueAveraging = (params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult => {
    let assetAccumulated = 0;
    let usdInvested = 0;
    let targetValue = 0;
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        targetValue += params.vaWeeklyGrowth;
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
            weeklyInvestment: investment,
        });
    }

    return {
        strategyName: 'valueAveraging',
        timeSeries,
        metrics: calculateMetrics(timeSeries),
    };
}


export const runSimulation = (params: SimulationParams, allPriceData: PriceDataPoint[]): StrategyResult[] => {
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    const filteredPriceData = allPriceData.filter(point => {
        const pointDate = new Date(point.date);
        return pointDate >= startDate && pointDate <= endDate;
    });

    if (filteredPriceData.length < 2) {
        throw new Error("Not enough data for the selected date range. Please select a wider range.");
    }

    const standardDcaResult = runStandardDCA(params, filteredPriceData);
    const dynamicDcaResult = runDynamicDCA(params, filteredPriceData);
    const valueAveragingResult = runValueAveraging(params, filteredPriceData);

    return [standardDcaResult, dynamicDcaResult, valueAveragingResult];
};