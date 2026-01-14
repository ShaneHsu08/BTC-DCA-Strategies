import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

// Bitcoin Logo SVG Component - Enhanced with gradient
const BitcoinLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="btcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" fill="url(#btcGradient)" />
        <path
            d="M15.5 9.5c0-1.5-1.2-2-2.5-2.1V6h-1v1.4h-.8V6h-1v1.4H8v1h.7c.4 0 .5.2.5.4v4.4c0 .2-.1.4-.5.4H8v1h2.2V16h1v-1.4h.8V16h1v-1.4c1.9-.1 3-1 3-2.6 0-1.2-.6-1.9-1.8-2.2.8-.3 1.3-.9 1.3-1.8zm-4.3-.6h1.3c.9 0 1.3.3 1.3 1s-.5 1-1.3 1h-1.3v-2zm2.8 5c0 .8-.5 1.1-1.5 1.1h-1.3v-2.2h1.3c1 0 1.5.3 1.5 1.1z"
            fill="#0F172A"
        />
    </svg>
);

// Decorative chart icon
const ChartIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
    </svg>
);

export const Header: React.FC = () => {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-4">
                    {/* Logo Container */}
                    <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/15 transition-colors duration-150">
                        <BitcoinLogo className="w-7 h-7" />
                    </div>

                    {/* Title Section */}
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground text-balance">
                                {t('header.title')}
                            </h1>
                            {/* Status badge */}
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Live
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Subtitle with icon */}
                    <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground border-r border-border/50 pr-4 mr-1">
                        <ChartIcon className="w-4 h-4 text-primary/70" />
                        <span className="text-foreground/70">{t('header.subtitle')}</span>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
};