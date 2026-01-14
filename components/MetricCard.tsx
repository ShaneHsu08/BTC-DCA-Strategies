
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
    return (
        <Card className="glass-panel overflow-hidden relative group card-glow">
            {/* Animated gradient background orb */}
            <div className="absolute -top-4 -right-4 w-24 h-24 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-emerald-500 blur-2xl"></div>
            </div>

            {/* Gradient accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{title}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/60">{value}</div>
                <p className="text-xs text-primary/80 pt-2 font-medium flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                    </svg>
                    {description}
                </p>
            </CardContent>
        </Card>
    );
};