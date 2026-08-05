const legacyHostname = "gallery.aleviclop.dev";
const productionHostname = "rawvives.aleviclop.dev";

interface PagesContext {
  request: Request;
  next(): Promise<Response>;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const requestUrl = new URL(context.request.url);
  if (requestUrl.hostname !== legacyHostname) return context.next();

  requestUrl.protocol = "https:";
  requestUrl.host = productionHostname;
  return Response.redirect(requestUrl, 308);
}
