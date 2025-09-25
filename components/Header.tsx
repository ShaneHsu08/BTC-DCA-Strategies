import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

// Bitcoin Logo SVG Component
const BitcoinLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.55.22.86.67 1.24.49.42 1.18.58 1.94.58 1.25 0 1.97-.59 1.97-1.43 0-.96-.73-1.38-1.48-1.65l-1.28-.5c-1.48-.59-2.33-1.46-2.33-2.89 0-1.72 1.39-2.84 3.11-2.84.6 0 1.09.1 1.49.3V4h2.67v1.95c1.43.36 2.41 1.32 2.45 2.87h-1.96c-.05-.49-.17-.78-.59-1.08-.46-.33-1.06-.45-1.73-.45-1.08 0-1.8.5-1.8 1.35 0 .8.6 1.17 1.2 1.4l1.19.5c1.56.65 2.38 1.43 2.38 2.85 0 1.72-1.33 2.83-3.04 2.83-.6 0-1.05-.1-1.45-.3z" 
            fill="currentColor"
        />
    </svg>
);

export const Header: React.FC = () => {
    const { t } = useLanguage();

    return (
        <header>
            <div className="container mx-auto flex items-center justify-between p-4 md:p-6">
                <div className="flex items-center space-x-3">
                    <BitcoinLogo className="w-8 h-8 text-orange-500" />
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {t('header.title')}
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        {t('header.subtitle')}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <LanguageSelector />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};