
import React from 'react';
import type { SimulationParams, InvestmentFrequency } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { useLanguage } from '../i18n/LanguageProvider';
import { assetRegistry, getAssetsByCategory, categoryNames, getAssetById } from '../data/assetRegistry';

interface InputFormProps {
    params: SimulationParams;
    setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
    onRunSimulation: () => void;
    isLoading: boolean;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-muted-foreground">
        <circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>
    </svg>
);

export const InputForm: React.FC<InputFormProps> = ({ params, setParams, onRunSimulation, isLoading }) => {
    const { t } = useLanguage();
    const selectedAsset = getAssetById(params.selectedAsset);
    const assetsByCategory = getAssetsByCategory();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams(prev => ({
            ...prev,
            selectedAsset: e.target.value,
        }));
    };

    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams(prev => ({
            ...prev,
            frequency: e.target.value as InvestmentFrequency,
        }));
    };

    // RSI Validation
    const validateRsiThresholds = () => {
        const errors: string[] = [];
        const { rsiExtremeLow, rsiLow, rsiHigh, rsiExtremeHigh } = params;

        // Check valid range (0-100)
        if (rsiExtremeLow < 0 || rsiExtremeLow > 100) errors.push('Extreme Low must be 0-100');
        if (rsiLow < 0 || rsiLow > 100) errors.push('Low must be 0-100');
        if (rsiHigh < 0 || rsiHigh > 100) errors.push('High must be 0-100');
        if (rsiExtremeHigh < 0 || rsiExtremeHigh > 100) errors.push('Extreme High must be 0-100');

        // Check ordering
        if (rsiExtremeLow >= rsiLow) errors.push('Extreme Low must be < Low');
        if (rsiLow >= rsiHigh) errors.push('Low must be < High');
        if (rsiHigh >= rsiExtremeHigh) errors.push('High must be < Extreme High');

        return errors;
    };

    const rsiErrors = validateRsiThresholds();
    const hasRsiErrors = rsiErrors.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t('form.title')}</CardTitle>
                <CardDescription>{t('form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <form onSubmit={(e) => { e.preventDefault(); onRunSimulation(); }} className="space-y-8">
                        {/* Asset Selector */}
                        <div className="space-y-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
                            <div className="space-y-2">
                                <Label htmlFor="selectedAsset" className="text-foreground/90 font-semibold">{t('form.selectAsset') || 'Select Asset'}</Label>
                                <select
                                    id="selectedAsset"
                                    name="selectedAsset"
                                    value={params.selectedAsset}
                                    onChange={handleAssetChange}
                                    className="w-full h-10 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    {Object.entries(assetsByCategory).map(([category, assets]) => (
                                        <optgroup key={category} label={categoryNames[category] || category}>
                                            {assets.map(asset => (
                                                <option key={asset.id} value={asset.id}>
                                                    {asset.code} - {asset.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                {selectedAsset && (
                                    <p className="text-xs text-muted-foreground mt-1">{selectedAsset.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Basic Settings */}
                        <div className="space-y-4 rounded-lg bg-secondary/30 p-4 border border-border/50">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="baseBudget" className="text-foreground/90">{t('form.baseBudget')}</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input id="baseBudget" name="baseBudget" type="number" value={params.baseBudget} onChange={handleChange} min="1" className="text-base pl-7" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="frequency" className="text-foreground/90">{t('form.frequency')}</Label>
                                    <select
                                        id="frequency"
                                        name="frequency"
                                        value={params.frequency}
                                        onChange={handleFrequencyChange}
                                        className="w-full h-10 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="daily">{t('form.frequencyDaily')}</option>
                                        <option value="weekly">{t('form.frequencyWeekly')}</option>
                                        <option value="monthly">{t('form.frequencyMonthly')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">{t('form.startDate')}</Label>
                                    <Input id="startDate" name="startDate" type="date" value={params.startDate} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">{t('form.endDate')}</Label>
                                    <Input id="endDate" name="endDate" type="date" value={params.endDate} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic DCA Settings */}
                        <div className="border-t border-border pt-6 space-y-4">
                            <h4 className="flex items-center gap-2 font-semibold text-card-foreground">
                                {t('form.dynamicDcaTitle')}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button" className="opacity-70 hover:opacity-100 transition-opacity"><InfoIcon /></button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p dangerouslySetInnerHTML={{ __html: t('form.dynamicDcaTooltip') }} />
                                    </TooltipContent>
                                </Tooltip>
                            </h4>

                            <div className="space-y-3 text-sm rounded-lg bg-secondary/30 p-4 border border-border/50">
                                <div className="grid grid-cols-3 gap-2 font-medium text-muted-foreground px-1 mb-2">
                                    <span>{t('form.rsiTierLabel')}</span>
                                    <span className="text-center">{t('form.rsiThresholdLabel')}</span>
                                    <span className="text-center">{t('form.budgetLabel')}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiExtremeLow" className="px-1 text-green-500 font-medium">{t('form.rsiExtremeLow')}</Label>
                                    <Input id="rsiExtremeLow" name="rsiExtremeLow" type="number" value={params.rsiExtremeLow} onChange={handleChange} className="text-center h-9" />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input name="budgetExtremeLow" type="number" value={params.budgetExtremeLow} onChange={handleChange} className="text-center h-9 pl-4 text-green-500 font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiLow" className="px-1 text-emerald-500/80">{t('form.rsiLow')}</Label>
                                    <Input id="rsiLow" name="rsiLow" type="number" value={params.rsiLow} onChange={handleChange} className="text-center h-9" />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input name="budgetLow" type="number" value={params.budgetLow} onChange={handleChange} className="text-center h-9 pl-4 text-emerald-500/80 font-semibold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center text-muted-foreground text-center border border-dashed border-border/50 rounded-md p-2 bg-background/20">
                                    <span className="text-left px-1 text-xs uppercase tracking-wide opacity-70">{t('form.rsiBaseWhen')}</span>
                                    <span className="text-xs">{`${params.rsiLow} - ${params.rsiHigh}`}</span>
                                    <span className="font-mono">{`$${params.baseBudget}`}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiHigh" className="px-1 text-orange-400">{t('form.rsiHigh')}</Label>
                                    <Input id="rsiHigh" name="rsiHigh" type="number" value={params.rsiHigh} onChange={handleChange} className="text-center h-9" />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input name="budgetHigh" type="number" value={params.budgetHigh} onChange={handleChange} className="text-center h-9 pl-4 text-orange-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiExtremeHigh" className="px-1 text-red-500 font-medium">{t('form.rsiExtremeHigh')}</Label>
                                    <Input id="rsiExtremeHigh" name="rsiExtremeHigh" type="number" value={params.rsiExtremeHigh} onChange={handleChange} className="text-center h-9" />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input name="budgetExtremeHigh" type="number" value={params.budgetExtremeHigh} onChange={handleChange} className="text-center h-9 pl-4 text-red-500 font-bold" />
                                    </div>
                                </div>

                                {/* RSI Validation Errors */}
                                {hasRsiErrors && (
                                    <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1">
                                        {rsiErrors.map((error, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                                <span>{error}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Value Averaging Settings */}
                        <div className="border-t border-border pt-6 space-y-4">
                            <h4 className="flex items-center gap-2 font-semibold text-card-foreground">
                                {t('form.valueAveragingTitle')}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button" className="opacity-70 hover:opacity-100 transition-opacity"><InfoIcon /></button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p dangerouslySetInnerHTML={{ __html: t('form.valueAveragingTooltip') }} />
                                    </TooltipContent>
                                </Tooltip>
                            </h4>
                            <div className="space-y-4 rounded-lg bg-secondary/30 p-4 border border-border/50">
                                <div className="space-y-2">
                                    <Label htmlFor="vaPeriodGrowth">{t('form.periodGrowth')}</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input id="vaPeriodGrowth" name="vaPeriodGrowth" type="number" value={params.vaPeriodGrowth} onChange={handleChange} min="0" className="pl-7" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vaMaxBuyCap">{t('form.maxBuyCap')}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input id="vaMaxBuyCap" name="vaMaxBuyCap" type="number" value={params.vaMaxBuyCap} onChange={handleChange} min="0" className="pl-7" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vaMaxSellCap">{t('form.maxSellCap')}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input id="vaMaxSellCap" name="vaMaxSellCap" type="number" value={params.vaMaxSellCap} onChange={handleChange} min="0" className="pl-7" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full !mt-8 text-base font-bold py-6 h-auto shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-white" disabled={isLoading || hasRsiErrors}>
                            {isLoading ? t('form.simulatingButton') : t('form.runButton')}
                        </Button>
                    </form>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};