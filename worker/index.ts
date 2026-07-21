import { getRootLocaleRedirect } from "../lib/i18n/locale-routing";

interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const redirect = getRootLocaleRedirect(request);
    if (!redirect) return env.ASSETS.fetch(request);

    return new Response(null, {
      status: 307,
      headers: {
        "Cache-Control": "private, no-store",
        Location: redirect.toString(),
        Vary: "Accept-Language, Cookie",
      },
    });
  },
};
