import { en } from './locales/en';
import { zh } from './locales/zh';
import { ja } from './locales/ja';

export const translations = {
    en,
    zh,
    ja,
};

export type Language = keyof typeof translations;

export function getNestedValue(obj: unknown, key: string): string | undefined {
    return key.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj) as string | undefined;
}

export function getTranslatedStrategyName(strategyKey: string, lang: Language): string {
    const key = `strategies.${strategyKey}`;
    return getNestedValue(translations[lang], key)
        ?? getNestedValue(translations.en, key)
        ?? strategyKey;
}
