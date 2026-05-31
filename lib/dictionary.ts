import 'server-only'

import type { Dictionary, Locale } from '@/types/dictionary'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const locales = ['en', 'es'] as const satisfies readonly Locale[];

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
