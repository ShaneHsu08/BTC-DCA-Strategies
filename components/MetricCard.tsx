
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground pt-1">{description}</p>
            </CardContent>
        </Card>
    );
};