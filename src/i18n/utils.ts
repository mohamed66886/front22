import { Locale } from './config';
import ar from './locales/ar.json';
import en from './locales/en.json';

const translations = {
  ar,
  en,
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.ar;
}
