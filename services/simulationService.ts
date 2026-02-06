import type { SimulationParams, PriceDataPoint, StrategyResult, Metrics, TimeSeriesPoint, InvestmentFrequency } from '../types';

const FREQUENCY_CONFIG: Record<InvestmentFrequency, { sampleRate: number; periodsPerYear: number }> = {
    daily: { sampleRate: 1, periodsPerYear: 365 },
    weekly: { sampleRate: 1, periodsPerYear: 52 },
    monthly: { sampleRate: 4, periodsPerYear: 12 },
};

function samplePriceData(priceData: PriceDataPoint[], frequency: InvestmentFrequency): PriceDataPoint[] {
    const { sampleRate } = FREQUENCY_CONFIG[frequency];
    if (sampleRate === 1) return priceData;
    return priceData.filter((_, index) => index % sampleRate === 0);
}

function getAnnualizationFactor(frequency: InvestmentFrequency): number {
    return Math.sqrt(FREQUENCY_CONFIG[frequency].periodsPerYear);
}

const EMPTY_METRICS: Metrics = {
    totalUsdInvested: 0,
    totalAssetAccumulated: 0,
    finalPortfolioValue: 0,
    averageCostBasis: 0,
    roiPercentage: 0,
    maxDrawdown: 0,
    sharpeRatio: 0,
};

function calculateMaxDrawdown(timeSeries: TimeSeriesPoint[]): number {
    let peakValue = 0;
    let maxDrawdown = 0;

    for (const point of timeSeries) {
        peakValue = Math.max(peakValue, point.portfolioValue);
        if (peakValue > 0) {
            const drawdown = (peakValue - point.portfolioValue) / peakValue;
            maxDrawdown = Math.max(maxDrawdown, drawdown);
        }
    }
    return maxDrawdown;
}

function calculateSharpeRatio(timeSeries: TimeSeriesPoint[], frequency: InvestmentFrequency): number {
    if (timeSeries.length < 3) return 0;

    const periodReturns = timeSeries.slice(1).map((point, i) => {
        const prevValue = timeSeries[i].portfolioValue;
        return prevValue > 0 ? (point.portfolioValue - prevValue) / prevValue : 0;
    });

    const meanReturn = periodReturns.reduce((sum, r) => sum + r, 0) / periodReturns.length;
    const variance = periodReturns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / (periodReturns.length - 1);
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;
    return (meanReturn / stdDev) * getAnnualizationFactor(frequency);
}

function calculateMetrics(timeSeries: TimeSeriesPoint[], frequency: InvestmentFrequency): Metrics {
    if (timeSeries.length < 2) return EMPTY_METRICS;

    const lastPoint = timeSeries[timeSeries.length - 1];
    const { usdInvested: totalUsdInvested, portfolioValue: finalPortfolioValue } = lastPoint;

    const roi = totalUsdInvested > 0
        ? ((finalPortfolioValue - totalUsdInvested) / totalUsdInvested) * 100
        : 0;

    return {
        totalUsdInvested,
        totalAssetAccumulated: lastPoint.assetAccumulated,
        finalPortfolioValue,
        averageCostBasis: lastPoint.averageCostBasis,
        roiPercentage: roi,
        maxDrawdown: calculateMaxDrawdown(timeSeries) * 100,
        sharpeRatio: calculateSharpeRatio(timeSeries, frequency),
    };
}

interface SimulationState {
    assetAccumulated: number;
    usdInvested: number;
}

function createTimeSeriesPoint(
    point: PriceDataPoint,
    state: SimulationState,
    periodInvestment: number
): TimeSeriesPoint {
    const portfolioValue = state.assetAccumulated * point.close;
    const averageCostBasis = state.usdInvested > 0 && state.assetAccumulated > 0
        ? state.usdInvested / state.assetAccumulated
        : 0;

    return {
        date: point.date,
        price: point.close,
        assetAccumulated: state.assetAccumulated,
        portfolioValue,
        averageCostBasis,
        usdInvested: state.usdInvested,
        periodInvestment,
    };
}

function getDynamicInvestment(params: SimulationParams, rsi: number | undefined): number {
    if (typeof rsi !== 'number' || !Number.isFinite(rsi)) {
        return params.baseBudget;
    }

    if (rsi <= params.rsiExtremeLow) return params.budgetExtremeLow;
    if (rsi <= params.rsiLow) return params.budgetLow;
    if (rsi >= params.rsiExtremeHigh) return params.budgetExtremeHigh;
    if (rsi >= params.rsiHigh) return params.budgetHigh;
    return params.baseBudget;
}

function isValidDateString(value: string): boolean {
    return Number.isFinite(Date.parse(`${value}T00:00:00Z`));
}

function validateSimulationParams(params: SimulationParams): void {
    const numericFields: Array<[string, number]> = [
        ['baseBudget', params.baseBudget],
        ['budgetExtremeLow', params.budgetExtremeLow],
        ['budgetLow', params.budgetLow],
        ['budgetHigh', params.budgetHigh],
        ['budgetExtremeHigh', params.budgetExtremeHigh],
        ['vaMaxBuyCap', params.vaMaxBuyCap],
        ['vaMaxSellCap', params.vaMaxSellCap],
        ['vaPeriodGrowth', params.vaPeriodGrowth],
    ];

    for (const [field, value] of numericFields) {
        if (!Number.isFinite(value)) {
            throw new Error(`Invalid numeric value for ${field}.`);
        }
        if (value < 0) {
            throw new Error(`${field} must be >= 0.`);
        }
    }

    const rsiValues = [params.rsiExtremeLow, params.rsiLow, params.rsiHigh, params.rsiExtremeHigh];
    if (rsiValues.some(value => !Number.isFinite(value) || value < 0 || value > 100)) {
        throw new Error('RSI thresholds must be between 0 and 100.');
    }

    if (!(params.rsiExtremeLow < params.rsiLow && params.rsiLow < params.rsiHigh && params.rsiHigh < params.rsiExtremeHigh)) {
        throw new Error('Invalid RSI threshold order.');
    }

    if (!isValidDateString(params.startDate) || !isValidDateString(params.endDate)) {
        throw new Error('Invalid start or end date.');
    }
}

function runStandardDCA(params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult {
    const state: SimulationState = { assetAccumulated: 0, usdInvested: 0 };
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        const investment = params.baseBudget;
        state.usdInvested += investment;
        state.assetAccumulated += investment / point.close;
        timeSeries.push(createTimeSeriesPoint(point, state, investment));
    }

    return {
        strategyName: 'standardDca',
        timeSeries,
        metrics: calculateMetrics(timeSeries, params.frequency),
    };
}

function runDynamicDCA(params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult {
    const state: SimulationState = { assetAccumulated: 0, usdInvested: 0 };
    const timeSeries: TimeSeriesPoint[] = [];

    for (const point of priceData) {
        const investment = getDynamicInvestment(params, point.rsi);
        state.usdInvested += investment;
        state.assetAccumulated += investment / point.close;
        timeSeries.push(createTimeSeriesPoint(point, state, investment));
    }

    return {
        strategyName: 'dynamicDca',
        timeSeries,
        metrics: calculateMetrics(timeSeries, params.frequency),
    };
}

function runValueAveraging(params: SimulationParams, priceData: PriceDataPoint[]): StrategyResult {
    const state: SimulationState = { assetAccumulated: 0, usdInvested: 0 };
    const timeSeries: TimeSeriesPoint[] = [];
    let targetValue = 0;

    for (const point of priceData) {
        targetValue += params.vaPeriodGrowth;
        const currentPortfolioValue = state.assetAccumulated * point.close;
        let investment = targetValue - currentPortfolioValue;

        // Apply caps: limit buying to maxBuyCap, selling to maxSellCap
        investment = investment > 0
            ? Math.min(investment, params.vaMaxBuyCap)
            : Math.max(investment, -params.vaMaxSellCap);

        state.usdInvested += investment;
        state.assetAccumulated = Math.max(0, state.assetAccumulated + investment / point.close);
        timeSeries.push(createTimeSeriesPoint(point, state, investment));
    }

    return {
        strategyName: 'valueAveraging',
        timeSeries,
        metrics: calculateMetrics(timeSeries, params.frequency),
    };
}


export function runSimulation(params: SimulationParams, allPriceData: PriceDataPoint[]): StrategyResult[] {
    validateSimulationParams(params);

    const startDate = new Date(`${params.startDate}T00:00:00Z`);
    const endDate = new Date(`${params.endDate}T00:00:00Z`);

    if (startDate >= endDate) {
        throw new Error('Start date must be before end date.');
    }

    const filteredPriceData = allPriceData
        .filter(point => {
            if (!isValidDateString(point.date)) return false;
            if (!Number.isFinite(point.close) || point.close <= 0) return false;

            const pointDate = new Date(`${point.date}T00:00:00Z`);
            return pointDate >= startDate && pointDate <= endDate;
        })
        .map(point => ({
            ...point,
            rsi: typeof point.rsi === 'number' && Number.isFinite(point.rsi) ? point.rsi : undefined,
        }));

    const sampledPriceData = samplePriceData(filteredPriceData, params.frequency);

    if (sampledPriceData.length < 2) {
        throw new Error("Not enough data for the selected date range. Please select a wider range.");
    }

    return [
        runStandardDCA(params, sampledPriceData),
        runDynamicDCA(params, sampledPriceData),
        runValueAveraging(params, sampledPriceData),
    ];
}
