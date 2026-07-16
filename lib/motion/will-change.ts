type StyleTarget = { style: Pick<CSSStyleDeclaration, "willChange"> };

export function applyTemporaryWillChange(
  target: StyleTarget,
  properties = "transform, opacity",
) {
  const previous = target.style.willChange;
  target.style.willChange = properties;

  return () => {
    target.style.willChange = previous;
  };
}
