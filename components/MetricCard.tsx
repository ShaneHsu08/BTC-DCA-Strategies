import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
}

// Trophy/Award icon for best performer
const TrophyIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
    // Determine if value is positive (for color coding)
    const isPositive = value.includes('%') && !value.startsWith('-');
    const hasPercentage = value.includes('%');

    return (
        <Card className="glass-panel overflow-hidden relative card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] text-balance">
                    {title}
                </CardTitle>
                {/* Status indicator */}
                <div className="w-2 h-2 rounded-full bg-green-500/80" />
            </CardHeader>

            <CardContent className="pt-1">
                {/* Main value */}
                <div
                    className={`text-3xl md:text-4xl font-bold tracking-tight metric-value ${hasPercentage && isPositive
                            ? 'text-green-500'
                            : 'text-foreground'
                        }`}
                >
                    {value}
                </div>

                {/* Strategy name badge */}
                <div className="flex items-center gap-2 pt-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                        <TrophyIcon />
                        <span className="text-xs font-medium text-accent/90 truncate max-w-[120px]">
                            {description}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};