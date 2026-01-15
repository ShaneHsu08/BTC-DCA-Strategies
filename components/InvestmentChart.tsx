import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';
import { CHART_COLORS, CHART_STYLES, formatDateForChart } from './chartConfig';

interface InvestmentChartProps {
    data: StrategyResult[];
}

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

    const locale = getLocale();

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                        {CHART_COLORS.map((color, index) => (
                            <linearGradient key={`bar-gradient-${index}`} id={`bar-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color.gradient[0]} stopOpacity={0.95} />
                                <stop offset="100%" stopColor={color.gradient[1]} stopOpacity={0.7} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid {...CHART_STYLES.grid} />
                    <XAxis
                        dataKey="date"
                        {...CHART_STYLES.xAxis}
                        tickFormatter={(str) => formatDateForChart(str, locale)}
                    />
                    <YAxis
                        {...CHART_STYLES.yAxis}
                        tickFormatter={yAxisFormatter}
                        width={50}
                        allowDataOverflow={true}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        {...CHART_STYLES.tooltip}
                        formatter={(value: number) => formatCurrency(value, locale)}
                        cursor={{ fill: 'hsl(var(--primary) / 0.05)' }}
                    />
                    <Legend {...CHART_STYLES.legend} />
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
                            fill={`url(#bar-gradient-${index % CHART_COLORS.length})`}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};