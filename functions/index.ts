import { getRootLocaleRedirect } from "../lib/i18n/locale-routing";

interface PagesContext {
  request: Request;
  next(): Promise<Response>;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const redirect = getRootLocaleRedirect(context.request);
  if (!redirect) return context.next();

  return new Response(null, {
    status: 307,
    headers: {
      "Cache-Control": "private, no-store",
      Location: redirect.toString(),
      Vary: "Accept-Language, Cookie",
    },
  });
}
