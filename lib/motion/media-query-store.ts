type MediaQueryListener = () => void;

type MediaQueryListLike = Pick<
  MediaQueryList,
  "matches" | "addEventListener" | "removeEventListener"
>;

type MediaStore = {
  listeners: Set<MediaQueryListener>;
  media: MediaQueryListLike;
  notify: () => void;
};

const stores = new Map<string, MediaStore>();

function getStore(query: string) {
  if (typeof window === "undefined") return null;

  const existing = stores.get(query);
  if (existing) return existing;

  const media = window.matchMedia(query);
  const store: MediaStore = {
    listeners: new Set(),
    media,
    notify: () => store.listeners.forEach((listener) => listener()),
  };
  stores.set(query, store);
  return store;
}

export function getMediaQuerySnapshot(query: string) {
  return getStore(query)?.media.matches ?? false;
}

export function subscribeMediaQuery(query: string, listener: MediaQueryListener) {
  const store = getStore(query);
  if (!store) return () => undefined;

  if (store.listeners.size === 0) {
    store.media.addEventListener("change", store.notify);
  }
  store.listeners.add(listener);

  return () => {
    store.listeners.delete(listener);
    if (store.listeners.size === 0) {
      store.media.removeEventListener("change", store.notify);
      stores.delete(query);
    }
  };
}

export function resetMediaQueryStoresForTests() {
  for (const store of stores.values()) {
    store.media.removeEventListener("change", store.notify);
  }
  stores.clear();
}
