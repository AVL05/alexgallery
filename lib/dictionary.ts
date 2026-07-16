import 'server-only'

import { notFound } from 'next/navigation'
import type { Dictionary, Locale } from '@/types/dictionary'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const locales = ['en', 'es'] as const satisfies readonly Locale[];

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (!isLocale(locale)) notFound();

  return dictionaries[locale]();
};
