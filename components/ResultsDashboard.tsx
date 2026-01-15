import React, { useState } from 'react';
import type { StrategyResult } from '../types';
import { MetricCard } from './MetricCard';
import { ComparisonTable } from './ComparisonTable';
import { PortfolioChart } from './PortfolioChart';
import { InvestmentChart } from './InvestmentChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
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
            <div className="loader-premium" />
            <div className="text-center space-y-2">
                <p className="text-foreground font-medium text-balance">{t('results.loading') || 'Running simulation...'}</p>
                <p className="text-muted-foreground text-sm text-pretty">
                    {t('results.loadingDescription') || 'Analyzing market data and strategies'}
                </p>
            </div>
        </div>
    );
};

const InitialState: React.FC = () => {
    const { t } = useLanguage();
    return (
        <Card className="h-full flex flex-col justify-center items-center text-center p-10 border-dashed border-2 border-primary/20 bg-primary/5">
            <div className="mb-8">
                <div className="p-5 rounded-2xl bg-primary/10 border border-primary/30">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                    >
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                </div>
            </div>

            <CardHeader className="p-0 max-w-lg">
                <CardTitle className="text-2xl md:text-3xl text-primary mb-3 text-balance">
                    {t('results.initialState.title')}
                </CardTitle>
                <CardDescription className="mt-3 text-base leading-relaxed text-pretty">
                    {t('results.initialState.description')}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 mt-8">
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                    {/* Feature badges */}
                    {['DCA', 'RSI-based', 'Value Averaging'].map((feature) => (
                        <div
                            key={feature}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
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

// Chart icons
const LineChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

const BarChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

const CostIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const StackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
);

// Log Scale Toggle Component
const LogScaleToggle: React.FC<{
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
}> = ({ enabled, onChange, label }) => (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <div className="relative">
            <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
            />
            <div className="w-10 h-5 bg-secondary/60 border border-border/40 rounded-full peer peer-checked:bg-primary/80 peer-checked:border-primary/60 transition-all duration-200" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-muted-foreground/60 rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-all duration-200 shadow-sm" />
        </div>
        <span className="text-sm font-medium text-muted-foreground peer-checked:text-foreground">
            {label}
        </span>
    </label>
);

// Tab configuration type
type ChartTabKey = 'portfolioValue' | 'assetAccumulated' | 'avgCostBasis' | 'periodInvestment';

interface ChartTabConfig {
    key: ChartTabKey;
    titleKey: string;
    descriptionKey: string;
    tabLabelKey: string;
    icon: React.ReactNode;
    dataKey?: 'portfolioValue' | 'assetAccumulated' | 'averageCostBasis';
    isBarChart?: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, isLoading }) => {
    const { language, t } = useLanguage();
    const [useLogScale, setUseLogScale] = useState(false);
    const [activeTab, setActiveTab] = useState<ChartTabKey>('portfolioValue');

    // Chart tab configurations
    const chartTabs: ChartTabConfig[] = [
        {
            key: 'portfolioValue',
            titleKey: 'results.charts.portfolioValueTitle',
            descriptionKey: 'results.charts.portfolioValueDescription',
            tabLabelKey: 'results.charts.tabPortfolioValue',
            icon: <LineChartIcon />,
            dataKey: 'portfolioValue',
        },
        {
            key: 'assetAccumulated',
            titleKey: 'results.charts.assetAccumulatedTitle',
            descriptionKey: 'results.charts.assetAccumulatedDescription',
            tabLabelKey: 'results.charts.tabAssetAccumulated',
            icon: <StackIcon />,
            dataKey: 'assetAccumulated',
        },
        {
            key: 'avgCostBasis',
            titleKey: 'results.charts.avgCostBasisTitle',
            descriptionKey: 'results.charts.avgCostBasisDescription',
            tabLabelKey: 'results.charts.tabAvgCostBasis',
            icon: <CostIcon />,
            dataKey: 'averageCostBasis',
        },
        {
            key: 'periodInvestment',
            titleKey: 'results.charts.periodInvestmentTitle',
            descriptionKey: 'results.charts.periodInvestmentDescription',
            tabLabelKey: 'results.charts.tabPeriodInvestment',
            icon: <BarChartIcon />,
            isBarChart: true,
        },
    ];

    const activeTabConfig = chartTabs.find(tab => tab.key === activeTab) || chartTabs[0];

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

            {/* Tabbed Charts */}
            <Card className="glass-panel card-glow overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                {activeTabConfig.icon}
                            </div>
                            <div>
                                <CardDescription className="text-base text-balance">
                                    {t(activeTabConfig.descriptionKey)}
                                </CardDescription>
                            </div>
                        </div>
                        {!activeTabConfig.isBarChart && (
                            <LogScaleToggle
                                enabled={useLogScale}
                                onChange={setUseLogScale}
                                label={t('results.charts.logScaleToggle') || 'Log Scale'}
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <Tabs defaultValue="portfolioValue" className="w-full" onTabChange={setActiveTab}>
                        <TabsList className="w-full sm:w-auto flex-wrap">
                            {chartTabs.map(tab => (
                                <TabsTrigger key={tab.key} value={tab.key} icon={tab.icon}>
                                    {t(tab.tabLabelKey) || tab.key}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="portfolioValue">
                            <PortfolioChart data={results} dataKey="portfolioValue" useLogScale={useLogScale} />
                        </TabsContent>

                        <TabsContent value="assetAccumulated">
                            <PortfolioChart data={results} dataKey="assetAccumulated" useLogScale={useLogScale} />
                        </TabsContent>

                        <TabsContent value="avgCostBasis">
                            <PortfolioChart data={results} dataKey="averageCostBasis" useLogScale={useLogScale} />
                        </TabsContent>

                        <TabsContent value="periodInvestment">
                            <InvestmentChart data={results} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};