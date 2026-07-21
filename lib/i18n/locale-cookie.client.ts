"use client";

import type { Locale } from "@/types/dictionary";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
} from "@/lib/i18n/locale-routing";

export function saveLocalePreference(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
}
