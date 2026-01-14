import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface InvestmentChartProps {
    data: StrategyResult[];
}

// Premium FinTech Palette: Electric Blue, Neon Green, Hot Pink
const COLORS = ['#3b82f6', '#10b981', '#f43f5e'];

export const InvestmentChart: React.FC<InvestmentChartProps> = ({ data }) => {
    const { language, getLocale } = useLanguage();

    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
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
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                        {COLORS.map((color, index) => (
                            <linearGradient key={`gradient-${index}`} id={`bar-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        stroke="hsl(var(--border))"
                        axisLine={{ strokeOpacity: 0.5 }}
                        tickLine={{ strokeOpacity: 0.5 }}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString(getLocale(), { year: '2-digit', month: 'short' });
                        }}
                    />
                    <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        stroke="hsl(var(--border))"
                        axisLine={{ strokeOpacity: 0.5 }}
                        tickLine={{ strokeOpacity: 0.5 }}
                        tickFormatter={yAxisFormatter}
                        allowDataOverflow={true}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card) / 0.95)',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.75rem',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
                        itemStyle={{ fontSize: '12px' }}
                        formatter={(value: number) => formatCurrency(value, getLocale())}
                    />
                    <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }} />
                    <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" strokeOpacity={0.5} />
                    {translatedData.map((strategy, index) => (
                        <Bar
                            key={strategy.strategyName}
                            dataKey={strategy.strategyName}
                            fill={`url(#bar-gradient-${index % COLORS.length})`}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};