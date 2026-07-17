export function getCleanShareUrl(origin: string, pathname: string) {
  return new URL(pathname, origin).toString();
}

export function shouldIgnorePhotoArrowKey(options: {
  tagName?: string;
  isContentEditable?: boolean;
  hasModifier?: boolean;
  overlayOpen?: boolean;
}) {
  return Boolean(
    options.hasModifier ||
    options.isContentEditable ||
    options.overlayOpen ||
    ["INPUT", "SELECT", "TEXTAREA", "BUTTON", "A"].includes(options.tagName || ""),
  );
}
