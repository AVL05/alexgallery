// Privacy-friendly analytics, build-time opt-in. Renders nothing unless a
// provider is configured, so the default production output stays cookie-free
// and needs no consent banner. Set at most one of:
// - NEXT_PUBLIC_PLAUSIBLE_DOMAIN (e.g. rawvives.aleviclop.dev)
// - NEXT_PUBLIC_CF_BEACON_TOKEN (Cloudflare Web Analytics token)
export function Analytics() {
  // Read inside the component so tests can set env per case; Next.js still
  // inlines NEXT_PUBLIC_* values at build time.
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN?.trim();
  if (cfBeaconToken) {
    return (
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
      />
    );
  }
  if (plausibleDomain) {
    return (
      <script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
      />
    );
  }
  return null;
}
