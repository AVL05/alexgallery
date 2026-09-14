// Shared BreadcrumbList builder so visual breadcrumbs and JSON-LD stay in
// sync. Every item keeps position order; only non-current items carry a URL.
export type BreadcrumbTrailItem = {
  name: string;
  url?: string;
};

export function buildBreadcrumbList(items: BreadcrumbTrailItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}
