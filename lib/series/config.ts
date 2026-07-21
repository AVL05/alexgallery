import type { PhotoSeries } from "@/lib/series/types";

export const photoSeries = [
  {
    id: "porto-river-night",
    slug: "porto-river-night",
    title: {
      es: "Oporto, del río a la noche",
      en: "Porto, from river to night",
    },
    description: {
      es: "Cinco escenas de Oporto conectadas por el río, la silueta urbana y el paso de la luz del día a la noche. Todas pertenecen al mismo lugar y al archivo de 2024.",
      en: "Five Porto scenes connected by the river, the city silhouette and the shift from daylight into night. All belong to the same place and the 2024 archive.",
    },
    coverPhotoId: 21,
    photoIds: [21, 19, 26, 27, 24],
    period: "2024",
    location: { es: "Oporto, Portugal", en: "Porto, Portugal" },
    criterion: "confirmed-location",
    status: "published",
    blocks: [
      { layout: "single", photoIds: [21] },
      { layout: "single", photoIds: [19] },
      { layout: "diptych", photoIds: [26, 27] },
      { layout: "single", photoIds: [24] },
    ],
  },
  {
    id: "atlantic-stone",
    slug: "atlantic-stone",
    title: { es: "Piedra atlántica", en: "Atlantic stone" },
    description: {
      es: "Una secuencia editorial entre acantilados atlánticos, presencia humana en Moher y arquitectura irlandesa. La relación se apoya en motivos y referencias reales; no afirma una única sesión.",
      en: "An editorial sequence spanning Atlantic cliffs, human presence at Moher and Irish architecture. The connection uses real motifs and references; it does not claim a single session.",
    },
    coverPhotoId: 17,
    photoIds: [17, 16, 46, 51],
    period: "2025",
    criterion: "editorial-affinity",
    status: "published",
    blocks: [
      { layout: "single", photoIds: [17] },
      { layout: "diptych", photoIds: [16, 46] },
      { layout: "single", photoIds: [51] },
    ],
  },
  {
    id: "small-encounters",
    slug: "small-encounters",
    title: { es: "Pequeños encuentros", en: "Small encounters" },
    description: {
      es: "Tres observaciones cercanas de fauna entre suelo, hojas y flores durante 2025. Es una afinidad visual de escala y atención, no una localización o jornada compartida.",
      en: "Three close observations of wildlife among ground, leaves and flowers during 2025. This is a visual affinity of scale and attention, not a shared place or day.",
    },
    coverPhotoId: 5,
    photoIds: [5, 11, 12],
    period: "2025",
    criterion: "editorial-affinity",
    status: "published",
    blocks: [
      { layout: "single", photoIds: [5] },
      { layout: "diptych", photoIds: [11, 12] },
    ],
  },
] as const satisfies readonly PhotoSeries[];
