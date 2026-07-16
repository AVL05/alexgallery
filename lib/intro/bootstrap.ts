import { INTRO_STORAGE_KEY, introTiming } from "@/lib/intro/constants";

export function createIntroBootstrapScript() {
  return `(() => {
    try {
      const root = document.documentElement;
      const isHome = /^\\/(es|en)\\/?$/.test(window.location.pathname);
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const automated = navigator.webdriver === true;
      const seen = window.sessionStorage.getItem('${INTRO_STORAGE_KEY}') === '1';
      if (!isHome || reduced || automated || seen) return;
      root.dataset.introPending = 'true';
      window.setTimeout(() => {
        delete root.dataset.introPending;
        root.dataset.introExpired = 'true';
      }, ${Math.round(introTiming.safetyTimeout * 1000)});
    } catch {
      delete document.documentElement.dataset.introPending;
      document.documentElement.dataset.introExpired = 'true';
    }
  })();`;
}
