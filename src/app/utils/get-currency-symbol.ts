type Currency = 'EUR' | 'USD';
type CurrencySymbol = '€' | '$';

const currencySymbols: Record<Currency, CurrencySymbol> = {
  EUR: '€',
  USD: '$'
};

export const getCurrencySymbol = (currency: Currency): CurrencySymbol => currencySymbols[currency];