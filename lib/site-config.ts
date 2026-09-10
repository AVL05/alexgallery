const productionSiteUrl = "https://rawvives.aleviclop.dev";

function normalizeSiteUrl(value: string | undefined) {
  const candidate = value?.trim() || productionSiteUrl;

  try {
    return new URL(candidate).origin;
  } catch {
    return productionSiteUrl;
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_BASE_URL);
export const instagramUrl = "https://www.instagram.com/raw.vives/";
export const contactEmail = "alexviclop@gmail.com";
export const developerUrl = "https://aleviclop.dev/";
export const web3FormsAccessKey =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() || "";
