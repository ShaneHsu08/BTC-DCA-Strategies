import { en } from './locales/en';
import { zh } from './locales/zh';
import { ja } from './locales/ja';

export const translations = {
    en,
    zh,
    ja,
};

export type Language = keyof typeof translations;

export const getTranslatedStrategyName = (strategyKey: string, lang: Language): string => {
    const key = `strategies.${strategyKey}`;
    const name = key.split('.').reduce((o, i) => (o ? o[i] : undefined), translations[lang] as any);
    if (!name) {
        // Fallback to English
        const fallback = key.split('.').reduce((o, i) => (o ? o[i] : undefined), translations.en as any);
        return fallback || strategyKey;
    }
    return name;
}
