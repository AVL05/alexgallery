import { getRootLocaleRedirect } from "../lib/i18n/locale-routing";

const legacyHostname = "gallery.aleviclop.dev";
const productionHostname = "rawvives.aleviclop.dev";

interface PagesContext {
  request: Request;
  next(): Promise<Response>;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  if (requestUrl.hostname === legacyHostname) {
    requestUrl.protocol = "https:";
    requestUrl.host = productionHostname;
    return Response.redirect(requestUrl, 308);
  }

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
