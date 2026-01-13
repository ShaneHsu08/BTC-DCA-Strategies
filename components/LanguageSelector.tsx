import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';
import { Language } from '../i18n';

export const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value as Language);
    };

    return (
        <div className="relative">
            <select
                value={language}
                onChange={handleChange}
                className="appearance-none bg-background/50 border border-input/50 glass-input rounded-lg py-2 pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 cursor-pointer hover:bg-background/80"
                aria-label="Select language"
            >
                <option value="en" className="bg-popover text-popover-foreground">English</option>
                <option value="zh" className="bg-popover text-popover-foreground">中文</option>
                <option value="ja" className="bg-popover text-popover-foreground">日本語</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground/70">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S5.922 9.581 5.516 9.163c-.409-.418-.436-1.17 0-1.615z" /></svg>
            </div>
        </div>
    );
};
