
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { runSimulation } from './services/simulationService';
import type { SimulationParams, StrategyResult } from './types';
import { btcPriceData } from './data/btcPriceData';
import { useLanguage } from './i18n/LanguageProvider';

const App: React.FC = () => {
    const { t } = useLanguage();
    const [simulationParams, setSimulationParams] = useState<SimulationParams>({
        weeklyBudget: 500,
        startDate: '2024-09-20',
        endDate: '2025-09-20',
        
        // New Dynamic DCA Defaults
        rsiExtremeLow: 30,
        budgetExtremeLow: 1000,
        rsiLow: 40,
        budgetLow: 750,
        rsiHigh: 70,
        budgetHigh: 375,
        rsiExtremeHigh: 80,
        budgetExtremeHigh: 250,

        vaMaxBuyCap: 1500,
        vaMaxSellCap: 500,
        vaWeeklyGrowth: 500,
    });
    const [results, setResults] = useState<StrategyResult[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunSimulation = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setResults(null);

        // Basic validation
        if (new Date(simulationParams.startDate) >= new Date(simulationParams.endDate)) {
            setError(t('error.endDateAfterStartDate'));
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            try {
                const simulationResults = runSimulation(simulationParams, btcPriceData);
                setResults(simulationResults);
            } catch (e) {
                if (e instanceof Error) {
                     if (e.message.includes("Not enough data")) {
                        setError(t('error.notEnoughData'));
                    } else {
                        setError(`${t('error.simulationFailed')}: ${e.message}`);
                    }
                } else {
                    setError(t('error.unknownError'));
                }
            } finally {
                setIsLoading(false);
            }
        }, 500); // Simulate network delay
    }, [simulationParams, t]);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <InputForm
                            params={simulationParams}
                            setParams={setSimulationParams}
                            onRunSimulation={handleRunSimulation}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="lg:col-span-8 xl:col-span-9">
                        {error && (
                            <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg mb-6">
                                <h3 className="font-bold">{t('error.title')}</h3>
                                <p>{error}</p>
                            </div>
                        )}
                        <ResultsDashboard results={results} isLoading={isLoading} />
                    </div>
                </div>
                <footer className="text-center text-muted-foreground mt-12 py-4">
                    <p>{t('footer.disclaimer')}</p>
                    <div className="mt-4 flex flex-col items-center gap-2 text-xs">
                        <div className="flex gap-4">
                        <span>© {new Date().getFullYear()} ShenYouX</span>
                            <a
                                href="https://github.com/ShaneHsu08/BTC-DCA-Strategies"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-blue-500"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://twitter.com/shenyou_x"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-blue-500"
                            >
                                Twitter
                            </a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default App;