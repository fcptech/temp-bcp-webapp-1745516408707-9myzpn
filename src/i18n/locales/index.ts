import en from './en';
import es from './es';
import pt from './pt';

export const locales = {
  en,
  es,
  pt,
};

export type LocaleKey = keyof typeof locales;