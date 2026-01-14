import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { runSimulation } from './services/simulationService';
import type { SimulationParams, StrategyResult } from './types';
import { getPriceDataForAsset } from './data/priceData';
import { useLanguage } from './i18n/LanguageProvider';

// Social icons
const GitHubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
);

const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const App: React.FC = () => {
    const { t } = useLanguage();
    const [simulationParams, setSimulationParams] = useState<SimulationParams>({
        selectedAsset: 'BTC',
        frequency: 'weekly',
        baseBudget: 500,
        startDate: '2024-09-20',
        endDate: '2025-09-20',

        // Dynamic DCA Defaults
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
        vaPeriodGrowth: 500,
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
                const priceData = getPriceDataForAsset(simulationParams.selectedAsset);
                const simulationResults = runSimulation(simulationParams, priceData);
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
        }, 500);
    }, [simulationParams, t]);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased relative">
            <Header />

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Sidebar Form */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="lg:sticky lg:top-24">
                            <InputForm
                                params={simulationParams}
                                setParams={setSimulationParams}
                                onRunSimulation={handleRunSimulation}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 fade-in">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 rounded-lg bg-destructive/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-destructive text-balance">{t('error.title')}</h3>
                                        <p className="text-sm text-destructive/80 mt-0.5 text-pretty">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <ResultsDashboard results={results} isLoading={isLoading} />
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-border/30">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Disclaimer */}
                        <p className="text-sm text-muted-foreground text-center md:text-left max-w-2xl text-pretty">
                            {t('footer.disclaimer')}
                        </p>

                        {/* Links */}
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} ShenYouX
                            </span>

                            <div className="flex items-center gap-3">
                                <a
                                    href="https://github.com/ShaneHsu08/BTC-DCA-Strategies"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                                    aria-label="GitHub"
                                >
                                    <GitHubIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                                <a
                                    href="https://twitter.com/shenyou_x"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                                    aria-label="Twitter"
                                >
                                    <TwitterIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom tagline */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-muted-foreground/60">
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default App;