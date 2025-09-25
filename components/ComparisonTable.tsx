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
        return value === bestValue ? 'text-primary font-semibold' : '';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('results.table.title')}</CardTitle>
                <CardDescription>{t('results.table.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-border">
                            <tr>
                                <th className="p-4 font-medium text-muted-foreground">{t('results.table.metric')}</th>
                                {results.map(result => (
                                    <th key={result.strategyName} className="p-4 font-medium text-muted-foreground text-right">
                                        {getTranslatedStrategyName(result.strategyName, language)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border">
                                <td className="p-4">{t('results.table.finalValue')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right ${getBestClass('finalPortfolioValue', r.metrics.finalPortfolioValue)}`}>
                                        {formatCurrency(r.metrics.finalPortfolioValue, getLocale())}
                                    </td>
                                ))}
                            </tr>
                             <tr className="border-b border-border">
                                <td className="p-4">{t('results.table.totalInvested')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className="p-4 text-right">
                                        {formatCurrency(r.metrics.totalUsdInvested, getLocale())}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-border">
                                <td className="p-4">{t('results.table.roi')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right ${getBestClass('roiPercentage', r.metrics.roiPercentage)}`}>
                                        {formatPercentage(r.metrics.roiPercentage)}
                                    </td>
                                ))}
                            </tr>
                             <tr className="border-b border-border">
                                <td className="p-4">{t('results.table.btcAccumulated')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right ${getBestClass('totalBtcAccumulated', r.metrics.totalBtcAccumulated)}`}>
                                        {formatBtc(r.metrics.totalBtcAccumulated)}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-border">
                                <td className="p-4">{t('results.table.avgCost')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right ${getBestClass('averageCostBasis', r.metrics.averageCostBasis)}`}>
                                        {formatCurrency(r.metrics.averageCostBasis, getLocale())}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b border-border">
                                <td className="p-4">{t('results.table.sharpeRatio')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right ${getBestClass('sharpeRatio', r.metrics.sharpeRatio)}`}>
                                        {formatNumber(r.metrics.sharpeRatio)}
                                    </td>
                                ))}
                            </tr>
                            <tr className="border-b-0">
                                <td className="p-4">{t('results.table.maxDrawdown')}</td>
                                {results.map(r => (
                                    <td key={r.strategyName} className={`p-4 text-right ${getBestClass('maxDrawdown', r.metrics.maxDrawdown)}`}>
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