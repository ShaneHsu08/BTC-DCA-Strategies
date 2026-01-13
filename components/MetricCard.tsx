
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
    return (
        <Card className="glass-panel overflow-hidden relative group hover:shadow-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {/* Placeholder for icon if needed */}
                <div className="w-16 h-16 rounded-full bg-primary blur-2xl"></div>
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{value}</div>
                <p className="text-xs text-muted-foreground pt-1 font-medium">{description}</p>
            </CardContent>
        </Card>
    );
};