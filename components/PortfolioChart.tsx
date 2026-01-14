import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency, formatBtc } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface PortfolioChartProps {
    data: StrategyResult[];
    dataKey: 'portfolioValue' | 'btcAccumulated' | 'assetAccumulated' | 'averageCostBasis';
}

// Premium Web3/Fintech Palette
const COLORS = [
    { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)', shadow: '0 0 20px rgba(59, 130, 246, 0.5)' },  // Electric Blue
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', shadow: '0 0 20px rgba(16, 185, 129, 0.5)' },  // Neon Green
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.1)', shadow: '0 0 20px rgba(245, 158, 11, 0.5)' },  // Bitcoin Orange
];

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, dataKey }) => {
    const { language, getLocale } = useLanguage();

    if (!data || data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
                No data to display.
            </div>
        );
    }

    const translatedData = data.map(strategy => ({
        ...strategy,
        strategyName: getTranslatedStrategyName(strategy.strategyName, language)
    }));

    // Combine time series data
    const chartData = translatedData[0].timeSeries.map((_, index) => {
        const point: { date: string;[key: string]: string | number } = {
            date: translatedData[0].timeSeries[index].date,
        };
        translatedData.forEach(strategy => {
            const actualKey = dataKey === 'btcAccumulated' ? 'assetAccumulated' : dataKey;
            point[strategy.strategyName] = strategy.timeSeries[index][actualKey];
        });
        return point;
    });

    const isCurrency = dataKey === 'portfolioValue' || dataKey === 'averageCostBasis';

    const yAxisFormatter = isCurrency
        ? (value: number) => {
            if (language === 'ja') {
                return `¥${(value / 10000).toFixed(0)}万`;
            }
            if (Math.abs(value) >= 1000000) {
                return `$${(value / 1000000).toFixed(1)}M`;
            }
            if (Math.abs(value) >= 1000) {
                return `$${(value / 1000).toFixed(0)}k`;
            }
            return `$${value.toFixed(0)}`;
        }
        : (value: number) => value.toFixed(4);

    const tooltipFormatter = isCurrency
        ? (value: number) => formatCurrency(value, getLocale())
        : (value: number) => formatBtc(value);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                        {COLORS.map((color, index) => (
                            <React.Fragment key={index}>
                                <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color.stroke} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color.stroke} stopOpacity={0} />
                                </linearGradient>
                                <filter id={`glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color.stroke} floodOpacity="0.4" />
                                </filter>
                            </React.Fragment>
                        ))}
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        stroke="hsl(var(--border))"
                        axisLine={{ strokeOpacity: 0.3 }}
                        tickLine={false}
                        tickMargin={8}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString(getLocale(), { month: 'short', day: 'numeric' });
                        }}
                    />
                    <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        stroke="hsl(var(--border))"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={4}
                        tickFormatter={yAxisFormatter}
                        width={55}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card) / 0.95)',
                            borderColor: 'hsl(var(--border) / 0.5)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 20px 40px -15px hsl(var(--background) / 0.5), 0 0 0 1px hsl(var(--border) / 0.3)',
                            padding: '12px 16px',
                        }}
                        labelStyle={{
                            color: 'hsl(var(--foreground))',
                            fontWeight: 600,
                            marginBottom: '8px',
                            fontFamily: 'var(--font-sans)'
                        }}
                        itemStyle={{
                            fontSize: '13px',
                            fontFamily: 'var(--font-mono)',
                            padding: '2px 0'
                        }}
                        formatter={tooltipFormatter}
                        cursor={{ stroke: 'hsl(var(--primary) / 0.3)', strokeWidth: 1 }}
                    />
                    <Legend
                        wrapperStyle={{
                            fontSize: '12px',
                            paddingTop: '16px',
                            fontFamily: 'var(--font-sans)'
                        }}
                        iconType="circle"
                        iconSize={8}
                    />
                    {translatedData.map((strategy, index) => (
                        <Area
                            key={strategy.strategyName}
                            type="monotone"
                            dataKey={strategy.strategyName}
                            stroke={COLORS[index % COLORS.length].stroke}
                            fill={`url(#gradient-${index % COLORS.length})`}
                            strokeWidth={2.5}
                            filter={`url(#glow-${index % COLORS.length})`}
                            dot={false}
                            activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                fill: 'hsl(var(--background))',
                                stroke: COLORS[index % COLORS.length].stroke
                            }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};