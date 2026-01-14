import React from 'react';
import type { StrategyResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { formatCurrency, formatBtc, formatPercentage, formatNumber } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface ComparisonTableProps {
    results: StrategyResult[];
}

// Crown icon for best performers
const CrownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" />
        <path d="M19 19H5v2h14v-2z" />
    </svg>
);

// Trend up icon
const TrendUpIcon: React.FC = () => (
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
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ results }) => {
    const { language, t, getLocale } = useLanguage();

    const getBestValue = (metric: keyof StrategyResult['metrics']) => {
        const values = results.map(r => r.metrics[metric]);
        const isMinBest = metric === 'averageCostBasis' || metric === 'maxDrawdown';
        return isMinBest ? Math.min(...values) : Math.max(...values);
    };

    const isBest = (metric: keyof StrategyResult['metrics'], value: number) => {
        return value === getBestValue(metric);
    };

    const getCellClass = (metric: keyof StrategyResult['metrics'], value: number) => {
        if (isBest(metric, value)) {
            return 'text-green-500 font-bold relative';
        }
        return 'text-muted-foreground';
    };

    const renderValue = (metric: keyof StrategyResult['metrics'], value: number, formatter: (v: number) => string) => {
        const best = isBest(metric, value);
        return (
            <div className="flex items-center justify-end gap-1.5">
                {best && <CrownIcon className="text-amber-500" />}
                <span className={best ? 'text-green-500' : ''}>{formatter(value)}</span>
            </div>
        );
    };

    return (
        <Card className="glass-panel overflow-hidden">
            <CardHeader className="relative">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
                        <TrendUpIcon />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{t('results.table.title')}</CardTitle>
                        <CardDescription>{t('results.table.description')}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto rounded-xl border border-border/30 table-premium">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/30">
                                <th className="p-4 text-left font-semibold text-muted-foreground uppercase tracking-wider text-xs bg-muted/30">
                                    {t('results.table.metric')}
                                </th>
                                {results.map((result, index) => (
                                    <th
                                        key={result.strategyName}
                                        className="p-4 text-right font-semibold bg-muted/30"
                                    >
                                        <div className="flex items-center justify-end gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{
                                                    backgroundColor: ['#3b82f6', '#10b981', '#f43f5e'][index % 3]
                                                }}
                                            />
                                            <span className="text-foreground">
                                                {getTranslatedStrategyName(result.strategyName, language)}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {/* Final Portfolio Value */}
                            <tr className="transition-colors hover:bg-primary/5">
                                <td className="p-4 font-medium text-foreground/90">
                                    {t('results.table.finalValue')}
                                </td>
                                {results.map(r => (
                                    <td
                                        key={r.strategyName}
                                        className={`p-4 text-right font-mono text-sm ${getCellClass('finalPortfolioValue', r.metrics.finalPortfolioValue)}`}
                                    >
                                        {renderValue('finalPortfolioValue', r.metrics.finalPortfolioValue,
                                            v => formatCurrency(v, getLocale()))}
                                    </td>
                                ))}
                            </tr>

                            {/* Total Invested */}
                            <tr className="transition-colors hover:bg-primary/5 bg-muted/10">
                                <td className="p-4 font-medium text-foreground/90">
                                    {t('results.table.totalInvested')}
                                </td>
                                {results.map(r => (
                                    <td key={r.strategyName} className="p-4 text-right font-mono text-sm text-muted-foreground">
                                        {formatCurrency(r.metrics.totalUsdInvested, getLocale())}
                                    </td>
                                ))}
                            </tr>

                            {/* ROI */}
                            <tr className="transition-colors hover:bg-primary/5">
                                <td className="p-4 font-medium text-foreground/90">
                                    {t('results.table.roi')}
                                </td>
                                {results.map(r => (
                                    <td
                                        key={r.strategyName}
                                        className={`p-4 text-right font-mono text-sm ${getCellClass('roiPercentage', r.metrics.roiPercentage)}`}
                                    >
                                        {renderValue('roiPercentage', r.metrics.roiPercentage, formatPercentage)}
                                    </td>
                                ))}
                            </tr>

                            {/* Asset Accumulated */}
                            <tr className="transition-colors hover:bg-primary/5 bg-muted/10">
                                <td className="p-4 font-medium text-foreground/90">
                                    {t('results.table.assetAccumulated') || t('results.table.btcAccumulated')}
                                </td>
                                {results.map(r => (
                                    <td
                                        key={r.strategyName}
                                        className={`p-4 text-right font-mono text-sm ${getCellClass('totalAssetAccumulated', r.metrics.totalAssetAccumulated)}`}
                                    >
                                        {renderValue('totalAssetAccumulated', r.metrics.totalAssetAccumulated, formatBtc)}
                                    </td>
                                ))}
                            </tr>

                            {/* Average Cost */}
                            <tr className="transition-colors hover:bg-primary/5">
                                <td className="p-4 font-medium text-foreground/90">
                                    {t('results.table.avgCost')}
                                </td>
                                {results.map(r => (
                                    <td
                                        key={r.strategyName}
                                        className={`p-4 text-right font-mono text-sm ${getCellClass('averageCostBasis', r.metrics.averageCostBasis)}`}
                                    >
                                        {renderValue('averageCostBasis', r.metrics.averageCostBasis,
                                            v => formatCurrency(v, getLocale()))}
                                    </td>
                                ))}
                            </tr>

                            {/* Max Drawdown */}
                            <tr className="transition-colors hover:bg-primary/5 bg-muted/10">
                                <td className="p-4 font-medium text-foreground/90">
                                    {t('results.table.maxDrawdown')}
                                </td>
                                {results.map(r => (
                                    <td
                                        key={r.strategyName}
                                        className={`p-4 text-right font-mono text-sm ${getCellClass('maxDrawdown', r.metrics.maxDrawdown)}`}
                                    >
                                        {renderValue('maxDrawdown', r.metrics.maxDrawdown, formatPercentage)}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <CrownIcon className="text-amber-500" />
                        <span>Best performer</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-green-500">●</span>
                        <span>Highlighted values</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};