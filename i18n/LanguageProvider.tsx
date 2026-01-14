import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations, Language, getNestedValue } from './index';

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
    getLocale: () => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LOCALE_MAP: Record<Language, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    ja: 'ja-JP',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string): string => {
        const translation = getNestedValue(translations[language], key);
        if (translation === undefined) {
            console.warn(`Translation key "${key}" not found for language "${language}".`);
            return getNestedValue(translations.en, key) ?? key;
        }
        return translation;
    }, [language]);

    const getLocale = useCallback((): string => LOCALE_MAP[language], [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, getLocale }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
