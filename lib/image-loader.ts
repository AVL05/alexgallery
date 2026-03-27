export default function imageLoader({ src, width }: { src: string; width: number }) {
  // If the src is already a full URL or doesn't start with / (except for public assets), return as is
  if (src.startsWith('http') || !src.startsWith('/')) return src;

  // Extract filename from path e.g. /14.webp -> 14.webp or /photos/optimized/original/14.webp -> 14.webp
  const segments = src.split('/');
  const fileName = segments[segments.length - 1];
  
  // If it's not a webp/jpg/png, return as is (e.g. svg)
  if (!/\.(jpe?g|png|webp|avif)$/i.test(fileName)) return src;

  // Map Next.js requested width to our pre-generated sizes
  if (width <= 400) return `/photos/optimized/400/${fileName}`;
  if (width <= 800) return `/photos/optimized/800/${fileName}`;
  if (width <= 1200) return `/photos/optimized/1200/${fileName}`;
  
  return `/photos/optimized/original/${fileName}`;
}

export { imageLoader };
