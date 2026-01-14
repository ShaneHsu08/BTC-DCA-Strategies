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
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        stroke="hsl(var(--border))"
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString(getLocale(), { year: '2-digit', month: 'short' });
                        }}
                    />
                    <YAxis
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        stroke="hsl(var(--border))"
                        tickFormatter={yAxisFormatter}
                        allowDataOverflow={true}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => formatCurrency(value, getLocale())}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                    {translatedData.map((strategy, index) => (
                        <Bar
                            key={strategy.strategyName}
                            dataKey={strategy.strategyName}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};