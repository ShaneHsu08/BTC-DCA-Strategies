import React from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { Button } from './ui/Button';

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 17.66 1.41-1.41" /><path d="m17.66 4.93 1.41-1.41" />
    </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            onClick={toggleTheme}
            className="bg-transparent hover:bg-background/80 hover:glass-panel shadow-none hover:shadow-lg transition-all p-0 h-10 w-10 border border-transparent hover:border-input/50"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ?
                <SunIcon className="text-foreground" /> :
                <MoonIcon className="text-foreground" />
            }
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};