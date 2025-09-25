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

const COLORS = ['#3b82f6', '#10b981', '#f97316'];

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
            return `$${(value / 1000).toFixed(0)}k`;
        }
        : (value: number) => value.toFixed(2);
        
    const tooltipFormatter = isCurrency
        ? (value: number) => formatCurrency(value, getLocale())
        : (value: number) => formatBtc(value);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                        stroke="#404040"
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            // Use a locale-sensitive date format
                            return date.toLocaleDateString(getLocale(), { year: '2-digit', month: 'short' });
                        }}
                    />
                    <YAxis 
                        tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                        stroke="#404040"
                        tickFormatter={yAxisFormatter}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(20, 20, 20, 0.9)',
                            borderColor: '#404040',
                            borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: '#f4f4f5' }}
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