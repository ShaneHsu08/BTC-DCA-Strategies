export const CHART_COLORS = [
    { stroke: '#3b82f6', gradient: ['#3b82f6', '#1d4ed8'] },  // Electric Blue
    { stroke: '#10b981', gradient: ['#10b981', '#059669'] },  // Neon Green
    { stroke: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },  // Bitcoin Orange
];

export const CHART_STYLES = {
    grid: {
        strokeDasharray: '3 3',
        stroke: 'hsl(var(--border))',
        strokeOpacity: 0.3,
        vertical: false,
    },
    xAxis: {
        tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 },
        stroke: 'hsl(var(--border))',
        axisLine: { strokeOpacity: 0.3 },
        tickLine: false,
        tickMargin: 8,
    },
    yAxis: {
        tick: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 },
        stroke: 'hsl(var(--border))',
        axisLine: false,
        tickLine: false,
        tickMargin: 4,
    },
    tooltip: {
        contentStyle: {
            backgroundColor: 'hsl(var(--card) / 0.95)',
            borderColor: 'hsl(var(--border) / 0.5)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 40px -15px hsl(var(--background) / 0.5), 0 0 0 1px hsl(var(--border) / 0.3)',
            padding: '12px 16px',
        },
        labelStyle: {
            color: 'hsl(var(--foreground))',
            fontWeight: 600,
            marginBottom: '8px',
            fontFamily: 'var(--font-sans)',
        },
        itemStyle: {
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            padding: '2px 0',
        },
    },
    legend: {
        wrapperStyle: {
            fontSize: '12px',
            paddingTop: '16px',
            fontFamily: 'var(--font-sans)',
        },
        iconType: 'circle' as const,
        iconSize: 8,
    },
};

export function formatDateForChart(dateStr: string, locale: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

export function formatCurrencyAxis(value: number, language: string): string {
    if (language === 'ja') {
        return `\u00A5${(value / 10000).toFixed(0)}\u4E07`;
    }
    if (Math.abs(value) >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
}
