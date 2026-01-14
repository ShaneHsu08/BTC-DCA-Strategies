import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface InvestmentChartProps {
    data: StrategyResult[];
}

// Premium Web3/Fintech Palette
const COLORS = [
    { main: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'] },  // Electric Blue
    { main: '#10b981', gradient: ['#10b981', '#059669'] },  // Neon Green
    { main: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },  // Bitcoin Orange
];

export const InvestmentChart: React.FC<InvestmentChartProps> = ({ data }) => {
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

    const chartData = translatedData[0].timeSeries.map((_, index) => {
        const point: { date: string;[key: string]: string | number } = {
            date: translatedData[0].timeSeries[index].date,
        };
        translatedData.forEach(strategy => {
            point[strategy.strategyName] = strategy.timeSeries[index].periodInvestment;
        });
        return point;
    });

    const yAxisFormatter = (value: number) => {
        if (Math.abs(value) >= 1000) {
            return `$${(value / 1000).toFixed(0)}k`;
        }
        return `$${value}`;
    };

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                        {COLORS.map((color, index) => (
                            <linearGradient key={`bar-gradient-${index}`} id={`bar-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color.gradient[0]} stopOpacity={0.95} />
                                <stop offset="100%" stopColor={color.gradient[1]} stopOpacity={0.7} />
                            </linearGradient>
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
                        width={50}
                        allowDataOverflow={true}
                        domain={['auto', 'auto']}
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
                        formatter={(value: number) => formatCurrency(value, getLocale())}
                        cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
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
                    <ReferenceLine
                        y={0}
                        stroke="hsl(var(--muted-foreground))"
                        strokeDasharray="3 3"
                        strokeOpacity={0.4}
                    />
                    {translatedData.map((strategy, index) => (
                        <Bar
                            key={strategy.strategyName}
                            dataKey={strategy.strategyName}
                            fill={`url(#bar-gradient-${index % COLORS.length})`}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};