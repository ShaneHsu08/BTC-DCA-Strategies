import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations, Language } from './index';

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
    getLocale: () => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper to access nested properties of an object using a dot-notation string
const getNestedTranslation = (obj: any, key: string): string => {
    return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = useCallback((key: string): string => {
        const translation = getNestedTranslation(translations[language], key);
        if (translation === undefined) {
            console.warn(`Translation key "${key}" not found for language "${language}".`);
            // Fallback to English
            const fallback = getNestedTranslation(translations.en, key);
            return fallback || key;
        }
        return translation;
    }, [language]);

    const getLocale = useCallback((): string => {
        const localeMap: Record<Language, string> = {
            en: 'en-US',
            zh: 'zh-CN',
            ja: 'ja-JP',
        };
        return localeMap[language];
    }, [language]);

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
