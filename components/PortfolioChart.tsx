import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency, formatBtc } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface PortfolioChartProps {
    data: StrategyResult[];
    dataKey: 'portfolioValue' | 'btcAccumulated' | 'averageCostBasis';
}

const COLORS = ['#3b82f6', '#22c55e', '#a855f7'];

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, dataKey }) => {
    const { language, getLocale } = useLanguage();

    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }
    
    const translatedData = data.map(strategy => ({
        ...strategy,
        strategyName: getTranslatedStrategyName(strategy.strategyName, language)
    }));
    
    // Combine time series data
    const chartData = translatedData[0].timeSeries.map((_, index) => {
        const point: { date: string; [key: string]: string | number } = {
            date: translatedData[0].timeSeries[index].date,
        };
        translatedData.forEach(strategy => {
            point[strategy.strategyName] = strategy.timeSeries[index][dataKey];
        });
        return point;
    });

    const isCurrency = dataKey === 'portfolioValue' || dataKey === 'averageCostBasis';

    const yAxisFormatter = isCurrency
        ? (value: number) => {
            if (language === 'ja') {
                return `¥${(value / 10000).toFixed(0)}万`;
            }
            if (Math.abs(value) >= 1000) {
                 return `$${(value / 1000).toFixed(0)}k`;
            }
            return `$${value.toFixed(0)}`;
        }
        : (value: number) => value.toFixed(2);
        
    const tooltipFormatter = isCurrency
        ? (value: number) => formatCurrency(value, getLocale())
        : (value: number) => formatBtc(value);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                        stroke="hsl(var(--border))"
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            // Use a locale-sensitive date format
                            return date.toLocaleDateString(getLocale(), { year: '2-digit', month: 'short' });
                        }}
                    />
                    <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                        stroke="hsl(var(--border))"
                        tickFormatter={yAxisFormatter}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={tooltipFormatter}
                    />
                    <Legend wrapperStyle={{fontSize: '14px'}} />
                    {translatedData.map((strategy, index) => (
                        <Line
                            key={strategy.strategyName}
                            type="monotone"
                            dataKey={strategy.strategyName}
                            stroke={COLORS[index % COLORS.length]}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};