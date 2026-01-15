import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { StrategyResult } from '../types';
import { formatCurrency, formatBtc } from '../utils';
import { useLanguage } from '../i18n/LanguageProvider';
import { getTranslatedStrategyName } from '../i18n';
import { CHART_COLORS, CHART_STYLES, formatDateForChart, formatCurrencyAxis } from './chartConfig';

interface PortfolioChartProps {
    data: StrategyResult[];
    dataKey: 'portfolioValue' | 'btcAccumulated' | 'assetAccumulated' | 'averageCostBasis';
    useLogScale?: boolean;
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ data, dataKey, useLogScale = false }) => {
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
            let value = strategy.timeSeries[index][actualKey];
            // For log scale, replace 0 or negative values with a small positive number
            if (useLogScale && value <= 0) {
                value = 0.0001;
            }
            point[strategy.strategyName] = value;
        });
        return point;
    });

    const isCurrency = dataKey === 'portfolioValue' || dataKey === 'averageCostBasis';

    const yAxisFormatter = isCurrency
        ? (value: number) => formatCurrencyAxis(value, language)
        : (value: number) => value.toFixed(4);

    const tooltipFormatter = isCurrency
        ? (value: number) => formatCurrency(value, getLocale())
        : (value: number) => formatBtc(value);

    const locale = getLocale();

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                        {CHART_COLORS.map((color, index) => (
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
                    <CartesianGrid {...CHART_STYLES.grid} />
                    <XAxis
                        dataKey="date"
                        {...CHART_STYLES.xAxis}
                        tickFormatter={(str) => formatDateForChart(str, locale)}
                    />
                    <YAxis
                        {...CHART_STYLES.yAxis}
                        tickFormatter={yAxisFormatter}
                        width={55}
                        scale={useLogScale ? 'log' : 'auto'}
                        domain={useLogScale ? ['auto', 'auto'] : [0, 'auto']}
                        allowDataOverflow={useLogScale}
                    />
                    <Tooltip
                        {...CHART_STYLES.tooltip}
                        formatter={tooltipFormatter}
                        cursor={{ stroke: 'hsl(var(--primary) / 0.3)', strokeWidth: 1 }}
                    />
                    <Legend {...CHART_STYLES.legend} />
                    {translatedData.map((strategy, index) => (
                        <Area
                            key={strategy.strategyName}
                            type="monotone"
                            dataKey={strategy.strategyName}
                            stroke={CHART_COLORS[index % CHART_COLORS.length].stroke}
                            fill={`url(#gradient-${index % CHART_COLORS.length})`}
                            strokeWidth={2.5}
                            filter={`url(#glow-${index % CHART_COLORS.length})`}
                            dot={false}
                            activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                fill: 'hsl(var(--background))',
                                stroke: CHART_COLORS[index % CHART_COLORS.length].stroke
                            }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};