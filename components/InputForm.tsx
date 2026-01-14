import React from 'react';
import type { SimulationParams, InvestmentFrequency } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { useLanguage } from '../i18n/LanguageProvider';
import { getAssetsByCategory, categoryNames, getAssetById } from '../data/assetRegistry';

interface InputFormProps {
    params: SimulationParams;
    setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
    onRunSimulation: () => void;
    isLoading: boolean;
}

// Info icon component
const InfoIcon: React.FC = () => (
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
        className="text-muted-foreground hover:text-primary transition-colors"
    >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

// Settings icon
const SettingsIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
    >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

// RSI icon
const RsiIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
    >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

// Value averaging icon
const ValueIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
    >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

// Play icon
const PlayIcon: React.FC = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

// Section Header Component
const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    tooltip?: string;
}> = ({ icon, title, tooltip }) => (
    <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20">
            {icon}
        </div>
        <h4 className="font-semibold text-foreground/90">{title}</h4>
        {tooltip && (
            <Tooltip>
                <TooltipTrigger asChild>
                    <button type="button" className="opacity-70 hover:opacity-100 transition-opacity cursor-help">
                        <InfoIcon />
                    </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p dangerouslySetInnerHTML={{ __html: tooltip }} />
                </TooltipContent>
            </Tooltip>
        )}
    </div>
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

        if (rsiExtremeLow < 0 || rsiExtremeLow > 100) errors.push('Extreme Low must be 0-100');
        if (rsiLow < 0 || rsiLow > 100) errors.push('Low must be 0-100');
        if (rsiHigh < 0 || rsiHigh > 100) errors.push('High must be 0-100');
        if (rsiExtremeHigh < 0 || rsiExtremeHigh > 100) errors.push('Extreme High must be 0-100');

        if (rsiExtremeLow >= rsiLow) errors.push('Extreme Low must be < Low');
        if (rsiLow >= rsiHigh) errors.push('Low must be < High');
        if (rsiHigh >= rsiExtremeHigh) errors.push('High must be < Extreme High');

        return errors;
    };

    const rsiErrors = validateRsiThresholds();
    const hasRsiErrors = rsiErrors.length > 0;

    // Custom select styling
    const selectClass = `
        w-full h-10 px-3 py-2 text-sm 
        bg-background/80 backdrop-blur-sm
        border border-border/60 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60
        hover:border-primary/40
        transition-all duration-300
        cursor-pointer
        appearance-none
        bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e')]
        bg-[length:16px] bg-[right_12px_center] bg-no-repeat
    `;

    return (
        <Card className="overflow-hidden relative">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
                        <SettingsIcon />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{t('form.title')}</CardTitle>
                        <CardDescription>{t('form.description')}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <TooltipProvider>
                    <form onSubmit={(e) => { e.preventDefault(); onRunSimulation(); }} className="space-y-6">

                        {/* Asset Selector Section */}
                        <div className="space-y-3 rounded-xl bg-gradient-to-br from-accent/10 via-primary/5 to-transparent p-4 border border-accent/20">
                            <Label htmlFor="selectedAsset" className="text-foreground/90 font-semibold text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                {t('form.selectAsset') || 'Select Asset'}
                            </Label>
                            <select
                                id="selectedAsset"
                                name="selectedAsset"
                                value={params.selectedAsset}
                                onChange={handleAssetChange}
                                className={selectClass}
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
                                <p className="text-xs text-muted-foreground mt-2 pl-1">{selectedAsset.description}</p>
                            )}
                        </div>

                        {/* Basic Settings Section */}
                        <div className="space-y-4 rounded-xl bg-secondary/20 p-4 border border-border/30">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="baseBudget" className="text-foreground/90 text-sm">{t('form.baseBudget')}</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">$</span>
                                        <Input
                                            id="baseBudget"
                                            name="baseBudget"
                                            type="number"
                                            value={params.baseBudget}
                                            onChange={handleChange}
                                            min="1"
                                            className="pl-7 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="frequency" className="text-foreground/90 text-sm">{t('form.frequency')}</Label>
                                    <select
                                        id="frequency"
                                        name="frequency"
                                        value={params.frequency}
                                        onChange={handleFrequencyChange}
                                        className={selectClass}
                                    >
                                        <option value="daily">{t('form.frequencyDaily')}</option>
                                        <option value="weekly">{t('form.frequencyWeekly')}</option>
                                        <option value="monthly">{t('form.frequencyMonthly')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate" className="text-sm">{t('form.startDate')}</Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={params.startDate}
                                        onChange={handleChange}
                                        className="font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate" className="text-sm">{t('form.endDate')}</Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={params.endDate}
                                        onChange={handleChange}
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic DCA Settings */}
                        <div className="space-y-4">
                            <SectionHeader
                                icon={<RsiIcon />}
                                title={t('form.dynamicDcaTitle')}
                                tooltip={t('form.dynamicDcaTooltip')}
                            />

                            <div className="space-y-2 text-sm rounded-xl bg-secondary/20 p-4 border border-border/30">
                                {/* Header row */}
                                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] gap-2 font-medium text-muted-foreground px-1 mb-3 text-xs uppercase tracking-wider">
                                    <span>{t('form.rsiTierLabel')}</span>
                                    <span className="text-center">{t('form.rsiThresholdLabel')}</span>
                                    <span className="text-center">{t('form.budgetLabel')}</span>
                                </div>

                                {/* RSI Extreme Low */}
                                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] gap-2 items-center rsi-extreme-low rounded-xl p-3">
                                    <Label htmlFor="rsiExtremeLow" className="px-1 text-green-500 font-semibold text-sm">
                                        {t('form.rsiExtremeLow')}
                                    </Label>
                                    <Input
                                        id="rsiExtremeLow"
                                        name="rsiExtremeLow"
                                        type="number"
                                        value={params.rsiExtremeLow}
                                        onChange={handleChange}
                                        className="text-center h-9 font-mono"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input
                                            name="budgetExtremeLow"
                                            type="number"
                                            value={params.budgetExtremeLow}
                                            onChange={handleChange}
                                            className="text-center h-9 pl-4 text-green-500 font-bold font-mono"
                                        />
                                    </div>
                                </div>

                                {/* RSI Low */}
                                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] gap-2 items-center rsi-low rounded-xl p-3">
                                    <Label htmlFor="rsiLow" className="px-1 text-emerald-500 font-medium text-sm">
                                        {t('form.rsiLow')}
                                    </Label>
                                    <Input
                                        id="rsiLow"
                                        name="rsiLow"
                                        type="number"
                                        value={params.rsiLow}
                                        onChange={handleChange}
                                        className="text-center h-9 font-mono"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input
                                            name="budgetLow"
                                            type="number"
                                            value={params.budgetLow}
                                            onChange={handleChange}
                                            className="text-center h-9 pl-4 text-emerald-500 font-semibold font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Base (neutral) */}
                                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] gap-2 items-center text-center border border-dashed border-border/40 rounded-xl p-3 bg-background/30">
                                    <span className="text-left px-1 text-xs uppercase tracking-wider text-muted-foreground">
                                        {t('form.rsiBaseWhen')}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {`${params.rsiLow} - ${params.rsiHigh}`}
                                    </span>
                                    <span className="font-mono font-medium text-muted-foreground">
                                        {`$${params.baseBudget}`}
                                    </span>
                                </div>

                                {/* RSI High */}
                                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] gap-2 items-center rsi-high rounded-xl p-3">
                                    <Label htmlFor="rsiHigh" className="px-1 text-amber-500 font-medium text-sm">
                                        {t('form.rsiHigh')}
                                    </Label>
                                    <Input
                                        id="rsiHigh"
                                        name="rsiHigh"
                                        type="number"
                                        value={params.rsiHigh}
                                        onChange={handleChange}
                                        className="text-center h-9 font-mono"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input
                                            name="budgetHigh"
                                            type="number"
                                            value={params.budgetHigh}
                                            onChange={handleChange}
                                            className="text-center h-9 pl-4 text-amber-500 font-medium font-mono"
                                        />
                                    </div>
                                </div>

                                {/* RSI Extreme High */}
                                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] gap-2 items-center rsi-extreme-high rounded-xl p-3">
                                    <Label htmlFor="rsiExtremeHigh" className="px-1 text-red-500 font-semibold text-sm">
                                        {t('form.rsiExtremeHigh')}
                                    </Label>
                                    <Input
                                        id="rsiExtremeHigh"
                                        name="rsiExtremeHigh"
                                        type="number"
                                        value={params.rsiExtremeHigh}
                                        onChange={handleChange}
                                        className="text-center h-9 font-mono"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-2 top-2 text-muted-foreground text-xs">$</span>
                                        <Input
                                            name="budgetExtremeHigh"
                                            type="number"
                                            value={params.budgetExtremeHigh}
                                            onChange={handleChange}
                                            className="text-center h-9 pl-4 text-red-500 font-bold font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Validation Errors */}
                                {hasRsiErrors && (
                                    <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs space-y-1.5">
                                        {rsiErrors.map((error, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="12" />
                                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                                <span>{error}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Value Averaging Settings */}
                        <div className="space-y-4">
                            <SectionHeader
                                icon={<ValueIcon />}
                                title={t('form.valueAveragingTitle')}
                                tooltip={t('form.valueAveragingTooltip')}
                            />

                            <div className="space-y-4 rounded-xl bg-secondary/20 p-4 border border-border/30">
                                <div className="space-y-2">
                                    <Label htmlFor="vaPeriodGrowth" className="text-sm">{t('form.periodGrowth')}</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            id="vaPeriodGrowth"
                                            name="vaPeriodGrowth"
                                            type="number"
                                            value={params.vaPeriodGrowth}
                                            onChange={handleChange}
                                            min="0"
                                            className="pl-7 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="vaMaxBuyCap" className="text-sm">{t('form.maxBuyCap')}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                id="vaMaxBuyCap"
                                                name="vaMaxBuyCap"
                                                type="number"
                                                value={params.vaMaxBuyCap}
                                                onChange={handleChange}
                                                min="0"
                                                className="pl-7 font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="vaMaxSellCap" className="text-sm">{t('form.maxSellCap')}</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                            <Input
                                                id="vaMaxSellCap"
                                                name="vaMaxSellCap"
                                                type="number"
                                                value={params.vaMaxSellCap}
                                                onChange={handleChange}
                                                min="0"
                                                className="pl-7 font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full !mt-8 text-base font-bold py-6 h-auto"
                            disabled={isLoading || hasRsiErrors}
                            size="lg"
                        >
                            <PlayIcon />
                            {isLoading ? t('form.simulatingButton') : t('form.runButton')}
                        </Button>
                    </form>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};