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

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col justify-center items-center h-full gap-4">
        <div className="loader-premium"></div>
        <p className="text-muted-foreground text-sm animate-pulse">Running simulation...</p>
    </div>
);

const InitialState: React.FC = () => {
    const { t } = useLanguage();
    return (
        <Card className="h-full flex flex-col justify-center items-center text-center p-10 border-dashed gradient-animated relative overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-emerald-500/20 rounded-full blur-3xl"></div>

            <div className="mb-6 float-animation">
                <div className="p-4 rounded-full bg-primary/10 glow-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                </div>
            </div>
            <CardHeader className="p-0 relative z-10">
                <CardTitle className="text-2xl md:text-3xl text-gradient">{t('results.initialState.title')}</CardTitle>
                <CardDescription className="mt-3 text-base max-w-md">
                    {t('results.initialState.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mt-6 relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span>{t('results.initialState.details')}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, isLoading }) => {
    const { language, t } = useLanguage();

    if (isLoading) {
        return <div className="h-[600px]"><LoadingSpinner /></div>;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 stagger-fade">
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

            <ComparisonTable results={results} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-panel card-glow">
                    <CardHeader>
                        <CardTitle>{t('results.charts.portfolioValueTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.portfolioValueDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PortfolioChart data={results} dataKey="portfolioValue" />
                    </CardContent>
                </Card>
                <Card className="glass-panel card-glow">
                    <CardHeader>
                        <CardTitle>{t('results.charts.assetAccumulatedTitle') || t('results.charts.btcAccumulatedTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.assetAccumulatedDescription') || t('results.charts.btcAccumulatedDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PortfolioChart data={results} dataKey="assetAccumulated" />
                    </CardContent>
                </Card>
                <Card className="glass-panel card-glow">
                    <CardHeader>
                        <CardTitle>{t('results.charts.avgCostBasisTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.avgCostBasisDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PortfolioChart data={results} dataKey="averageCostBasis" />
                    </CardContent>
                </Card>
                <Card className="glass-panel card-glow">
                    <CardHeader>
                        <CardTitle>{t('results.charts.periodInvestmentTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.periodInvestmentDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InvestmentChart data={results} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};