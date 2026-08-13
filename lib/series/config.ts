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
      es: "Cinco escenas de Oporto, desde el río y la silueta urbana hasta la llegada de la noche.",
      en: "Five scenes of Porto, from the river and city skyline to nightfall.",
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
      es: "Acantilados atlánticos, presencia humana en Moher y arquitectura irlandesa.",
      en: "Atlantic cliffs, human presence at Moher and Irish architecture.",
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
      es: "Tres encuentros cercanos con la fauna entre hojas, flores y caminos.",
      en: "Three close encounters with wildlife among leaves, flowers and paths.",
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
