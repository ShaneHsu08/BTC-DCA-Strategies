import React from 'react';
import type { StrategyResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { formatCurrency, formatBtc, formatPercentage, formatNumber } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface ComparisonTableProps {
    results: StrategyResult[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ results }) => {
    const { language, t, getLocale } = useLanguage();

    const getBestClass = (metric: keyof StrategyResult['metrics'], value: number) => {
        const values = results.map(r => r.metrics[metric]);
        const isMinBest = metric === 'averageCostBasis' || metric === 'maxDrawdown';
        const bestValue = isMinBest ? Math.min(...values) : Math.max(...values);
        // Using neon green/emerald for positive bests, maybe lighter text for neutral
        return value === bestValue ? 'text-emerald-500 font-bold' : 'text-muted-foreground';
    };

    return (
        <Card className="glass-panel">
            <CardHeader>
                <CardTitle>{t('results.table.title')}</CardTitle>
                <CardDescription>{t('results.table.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto rounded-lg border border-border/50 table-premium">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-4 font-medium text-muted-foreground uppercase tracking-wider text-xs">{t('results.table.metric')}</th>
                                {results.map(result => (
                                    <th key={result.strategyName} className="p-4 font-semibold text-foreground text-right">
                                        {getTranslatedStrategyName(result.strategyName, language)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{t('results.table.finalValue')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right font-mono ${getBestClass('finalPortfolioValue', r.metrics.finalPortfolioValue)}`}>
                                        {formatCurrency(r.metrics.finalPortfolioValue, getLocale())}
                                    </td>
                                ))}
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{t('results.table.totalInvested')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className="p-4 text-right font-mono text-muted-foreground">
                                        {formatCurrency(r.metrics.totalUsdInvested, getLocale())}
                                    </td>
                                ))}
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{t('results.table.roi')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right font-mono ${getBestClass('roiPercentage', r.metrics.roiPercentage)}`}>
                                        {formatPercentage(r.metrics.roiPercentage)}
                                    </td>
                                ))}
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{t('results.table.assetAccumulated') || t('results.table.btcAccumulated')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right font-mono ${getBestClass('totalAssetAccumulated', r.metrics.totalAssetAccumulated)}`}>
                                        {formatBtc(r.metrics.totalAssetAccumulated)}
                                    </td>
                                ))}
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{t('results.table.avgCost')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right font-mono ${getBestClass('averageCostBasis', r.metrics.averageCostBasis)}`}>
                                        {formatCurrency(r.metrics.averageCostBasis, getLocale())}
                                    </td>
                                ))}
                            </tr>
                            <tr className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{t('results.table.maxDrawdown')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right font-mono ${getBestClass('maxDrawdown', r.metrics.maxDrawdown)}`}>
                                        {formatPercentage(r.metrics.maxDrawdown)}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};