export const formatCurrency = (value: number, locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatNumber = (value: number, decimalPlaces = 2): string => {
    return value.toFixed(decimalPlaces);
};

export const formatBtc = (value: number): string => {
    return `${value.toFixed(8)} BTC`;
};

export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
};