import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';

interface InvestmentChartProps {
    data: StrategyResult[];
}

const COLORS = ['#3b82f6', '#10b981', '#f97316'];

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
        const point: { date: string; [key: string]: string | number } = {
            date: translatedData[0].timeSeries[index].date,
        };
        translatedData.forEach(strategy => {
            point[strategy.strategyName] = strategy.timeSeries[index].weeklyInvestment;
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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                        stroke="#404040"
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString(getLocale(), { year: '2-digit', month: 'short' });
                        }}
                    />
                    <YAxis 
                        tick={{ fill: '#a1a1aa', fontSize: 12 }} 
                        stroke="#404040"
                        tickFormatter={yAxisFormatter}
                        allowDataOverflow={true}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(20, 20, 20, 0.9)',
                            borderColor: '#404040',
                            borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: '#f4f4f5' }}
                        formatter={(value: number) => formatCurrency(value, getLocale())}
                    />
                    <Legend wrapperStyle={{fontSize: '14px'}} />
                    <ReferenceLine y={0} stroke="#a1a1aa" strokeDasharray="2 2" />
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