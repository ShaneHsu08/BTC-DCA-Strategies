
import React from 'react';
import type { SimulationParams } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/Tooltip';
import { useLanguage } from '../i18n/LanguageProvider';

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
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setParams(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('form.title')}</CardTitle>
                <CardDescription>{t('form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <form onSubmit={(e) => { e.preventDefault(); onRunSimulation(); }} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="weeklyBudget">{t('form.weeklyBudget')}</Label>
                            <Input id="weeklyBudget" name="weeklyBudget" type="number" value={params.weeklyBudget} onChange={handleChange} min="1" className="text-base" />
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

                        <div className="border-t border-border pt-8 space-y-4">
                            <h4 className="font-semibold text-card-foreground">{t('form.dynamicDcaTitle')}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button"><InfoIcon /></button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p dangerouslySetInnerHTML={{ __html: t('form.dynamicDcaTooltip') }} />
                                    </TooltipContent>
                                </Tooltip>
                            </h4>
                             <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-3 gap-2 font-medium text-muted-foreground px-1">
                                    <span>{t('form.rsiTierLabel')}</span>
                                    <span className="text-center">{t('form.rsiThresholdLabel')}</span>
                                    <span className="text-center">{t('form.budgetLabel')}</span>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiExtremeLow" className="px-1">{t('form.rsiExtremeLow')}</Label>
                                    <Input id="rsiExtremeLow" name="rsiExtremeLow" type="number" value={params.rsiExtremeLow} onChange={handleChange} className="text-center" />
                                    <Input name="budgetExtremeLow" type="number" value={params.budgetExtremeLow} onChange={handleChange} className="text-center" />
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiLow" className="px-1">{t('form.rsiLow')}</Label>
                                    <Input id="rsiLow" name="rsiLow" type="number" value={params.rsiLow} onChange={handleChange} className="text-center" />
                                    <Input name="budgetLow" type="number" value={params.budgetLow} onChange={handleChange} className="text-center" />
                                </div>

                                 <div className="grid grid-cols-3 gap-2 items-center text-muted-foreground text-center border border-dashed rounded-md p-2">
                                    <span className="text-left px-1">{t('form.rsiBaseWhen')}</span>
                                    <span>{`${params.rsiLow} - ${params.rsiHigh}`}</span>
                                    <span>{`$${params.weeklyBudget}`}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiHigh" className="px-1">{t('form.rsiHigh')}</Label>
                                    <Input id="rsiHigh" name="rsiHigh" type="number" value={params.rsiHigh} onChange={handleChange} className="text-center" />
                                    <Input name="budgetHigh" type="number" value={params.budgetHigh} onChange={handleChange} className="text-center" />
                                </div>

                                <div className="grid grid-cols-3 gap-2 items-center">
                                    <Label htmlFor="rsiExtremeHigh" className="px-1">{t('form.rsiExtremeHigh')}</Label>
                                    <Input id="rsiExtremeHigh" name="rsiExtremeHigh" type="number" value={params.rsiExtremeHigh} onChange={handleChange} className="text-center" />
                                    <Input name="budgetExtremeHigh" type="number" value={params.budgetExtremeHigh} onChange={handleChange} className="text-center" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-border pt-8 space-y-4">
                            <h4 className="font-semibold text-card-foreground">{t('form.valueAveragingTitle')}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button type="button"><InfoIcon /></button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p dangerouslySetInnerHTML={{ __html: t('form.valueAveragingTooltip') }} />
                                    </TooltipContent>
                                </Tooltip>
                            </h4>
                            <div className="space-y-2">
                                <Label htmlFor="vaWeeklyGrowth">{t('form.weeklyGrowth')}</Label>
                                <Input id="vaWeeklyGrowth" name="vaWeeklyGrowth" type="number" value={params.vaWeeklyGrowth} onChange={handleChange} min="0" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="vaMaxBuyCap">{t('form.maxBuyCap')}</Label>
                                    <Input id="vaMaxBuyCap" name="vaMaxBuyCap" type="number" value={params.vaMaxBuyCap} onChange={handleChange} min="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vaMaxSellCap">{t('form.maxSellCap')}</Label>
                                    <Input id="vaMaxSellCap" name="vaMaxSellCap" type="number" value={params.vaMaxSellCap} onChange={handleChange} min="0" />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full !mt-10 text-base font-semibold py-3 h-auto" disabled={isLoading}>
                            {isLoading ? t('form.simulatingButton') : t('form.runButton')}
                        </Button>
                    </form>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
};