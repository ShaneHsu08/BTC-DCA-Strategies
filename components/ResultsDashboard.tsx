import React from 'react';
import type { StrategyResult } from '../types';
import { MetricCard } from './MetricCard';
import { ComparisonTable } from './ComparisonTable';
import { PortfolioChart } from './PortfolioChart';
import { InvestmentChart } from './InvestmentChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface ResultsDashboardProps {
    results: StrategyResult[] | null;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col justify-center items-center h-full gap-6">
            <div className="relative">
                <div className="loader-premium" />
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-foreground font-medium">{t('results.loading') || 'Running simulation...'}</p>
                <p className="text-muted-foreground text-sm animate-pulse">
                    {t('results.loadingDescription') || 'Analyzing market data and strategies'}
                </p>
            </div>
        </div>
    );
};

const InitialState: React.FC = () => {
    const { t } = useLanguage();
    return (
        <Card className="h-full flex flex-col justify-center items-center text-center p-10 border-dashed border-2 border-primary/20 gradient-animated relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-primary/25 to-accent/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-tr from-accent/20 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 grid-pattern opacity-30" />

            <div className="mb-8 float-animation relative">
                <div className="relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl" />
                    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border border-primary/30 neon-glow-blue">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="56"
                            height="56"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="url(#chartGradient)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <defs>
                                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                                </linearGradient>
                            </defs>
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                    </div>
                </div>
            </div>

            <CardHeader className="p-0 relative z-10 max-w-lg">
                <CardTitle className="text-2xl md:text-3xl text-gradient mb-3">
                    {t('results.initialState.title')}
                </CardTitle>
                <CardDescription className="mt-3 text-base leading-relaxed">
                    {t('results.initialState.description')}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 mt-8 relative z-10">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                    {/* Feature badges */}
                    {['DCA', 'RSI-based', 'Value Averaging'].map((feature, i) => (
                        <div
                            key={feature}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-500"
                            >
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                            <span className="text-foreground/80 font-medium">{feature}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Chart Card Component for consistent styling
const ChartCard: React.FC<{
    title: string;
    description: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}> = ({ title, description, children, icon }) => (
    <Card className="glass-panel card-glow overflow-hidden">
        <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
                        {icon}
                    </div>
                )}
                <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="mt-1">{description}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="chart-container">
            {children}
        </CardContent>
    </Card>
);

// Chart icons
const LineChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const CostIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const StackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, isLoading }) => {
    const { language, t } = useLanguage();

    if (isLoading) {
        return <div className="h-[600px] flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (!results) {
        return <InitialState />;
    }

    const bestAssetAccumulated = Math.max(...results.map(r => r.metrics.totalAssetAccumulated));
    const bestRoi = Math.max(...results.map(r => r.metrics.roiPercentage));
    const mostEfficient = Math.min(...results.map(r => r.metrics.totalUsdInvested));
    const lowestDrawdown = Math.min(...results.map(r => r.metrics.maxDrawdown));

    const getStrategyName = (strategyKey: string) => getTranslatedStrategyName(strategyKey, language);

    return (
        <div className="space-y-8 fade-in">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 stagger-fade">
                <MetricCard
                    title={t('results.metrics.bestAsset') || t('results.metrics.bestBtc')}
                    value={`${bestAssetAccumulated.toFixed(4)}`}
                    description={getStrategyName(results.find(r => r.metrics.totalAssetAccumulated === bestAssetAccumulated)?.strategyName || '')}
                />
                <MetricCard
                    title={t('results.metrics.highestRoi')}
                    value={`${bestRoi.toFixed(2)}%`}
                    description={getStrategyName(results.find(r => r.metrics.roiPercentage === bestRoi)?.strategyName || '')}
                />
                <MetricCard
                    title={t('results.metrics.mostCapitalEfficient')}
                    value={`$${mostEfficient.toLocaleString()}`}
                    description={getStrategyName(results.find(r => r.metrics.totalUsdInvested === mostEfficient)?.strategyName || '')}
                />
                <MetricCard
                    title={t('results.metrics.lowestDrawdown')}
                    value={`${lowestDrawdown.toFixed(2)}%`}
                    description={getStrategyName(results.find(r => r.metrics.maxDrawdown === lowestDrawdown)?.strategyName || '')}
                />
            </div>

            {/* Comparison Table */}
            <ComparisonTable results={results} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                    title={t('results.charts.portfolioValueTitle')}
                    description={t('results.charts.portfolioValueDescription')}
                    icon={<LineChartIcon />}
                >
                    <PortfolioChart data={results} dataKey="portfolioValue" />
                </ChartCard>

                <ChartCard
                    title={t('results.charts.assetAccumulatedTitle') || t('results.charts.btcAccumulatedTitle')}
                    description={t('results.charts.assetAccumulatedDescription') || t('results.charts.btcAccumulatedDescription')}
                    icon={<StackIcon />}
                >
                    <PortfolioChart data={results} dataKey="assetAccumulated" />
                </ChartCard>

                <ChartCard
                    title={t('results.charts.avgCostBasisTitle')}
                    description={t('results.charts.avgCostBasisDescription')}
                    icon={<CostIcon />}
                >
                    <PortfolioChart data={results} dataKey="averageCostBasis" />
                </ChartCard>

                <ChartCard
                    title={t('results.charts.periodInvestmentTitle')}
                    description={t('results.charts.periodInvestmentDescription')}
                    icon={<BarChartIcon />}
                >
                    <InvestmentChart data={results} />
                </ChartCard>
            </div>
        </div>
    );
};