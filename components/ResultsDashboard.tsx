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
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
);

const InitialState: React.FC = () => {
    const { t } = useLanguage();
    return (
     <Card className="h-full flex flex-col justify-center items-center text-center">
        <CardHeader>
            <CardTitle>{t('results.initialState.title')}</CardTitle>
            <CardDescription>
                {t('results.initialState.description')}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{t('results.initialState.details')}</p>
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
    
    const bestBtcAccumulated = Math.max(...results.map(r => r.metrics.totalBtcAccumulated));
    const bestRoi = Math.max(...results.map(r => r.metrics.roiPercentage));

    const getStrategyName = (strategyKey: string) => getTranslatedStrategyName(strategyKey, language);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard 
                    title={t('results.metrics.bestBtc')}
                    value={`${bestBtcAccumulated.toFixed(4)} BTC`} 
                    description={getStrategyName(results.find(r => r.metrics.totalBtcAccumulated === bestBtcAccumulated)?.strategyName || '')} 
                />
                <MetricCard 
                    title={t('results.metrics.highestRoi')}
                    value={`${bestRoi.toFixed(2)}%`}
                    description={getStrategyName(results.find(r => r.metrics.roiPercentage === bestRoi)?.strategyName || '')}
                />
                <MetricCard 
                    title={t('results.metrics.mostCapitalEfficient')}
                    value={`$${Math.min(...results.map(r => r.metrics.totalUsdInvested)).toLocaleString()}`} 
                    description={getStrategyName(results.find(r => r.metrics.totalUsdInvested === Math.min(...results.map(r => r.metrics.totalUsdInvested)))?.strategyName || '')} 
                />
                <MetricCard 
                    title={t('results.metrics.lowestDrawdown')}
                    value={`${Math.min(...results.map(r => r.metrics.maxDrawdown)).toFixed(2)}%`}
                    description={getStrategyName(results.find(r => r.metrics.maxDrawdown === Math.min(...results.map(r => r.metrics.maxDrawdown)))?.strategyName || '')} 
                />
            </div>
            
            <ComparisonTable results={results} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>{t('results.charts.portfolioValueTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.portfolioValueDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PortfolioChart data={results} dataKey="portfolioValue" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('results.charts.btcAccumulatedTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.btcAccumulatedDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PortfolioChart data={results} dataKey="btcAccumulated" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('results.charts.avgCostBasisTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.avgCostBasisDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PortfolioChart data={results} dataKey="averageCostBasis" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('results.charts.weeklyInvestmentTitle')}</CardTitle>
                        <CardDescription>{t('results.charts.weeklyInvestmentDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InvestmentChart data={results} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};