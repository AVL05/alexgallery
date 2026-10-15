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
      es: "El Duero, la torre de los Clérigos, un músico al atardecer y un tranvía nocturno. Cinco escenas reúnen la escala de Oporto y la vida que transcurre entre sus luces.",
      en: "The Douro, Clérigos Tower, a musician at sunset and a night tram. Five scenes bring together Porto's scale and the life unfolding among its lights.",
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
      es: "Una torre entre la niebla, una roca en el mar y un acordeonista frente a Moher. La piedra conecta estas imágenes con la arquitectura irlandesa; las presencias humanas dan la medida del paisaje.",
      en: "A tower in the mist, a rock in the sea and an accordionist at Moher. Stone connects these images with Irish architecture; human figures reveal the landscape's scale.",
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
      es: "Una ardilla que come y dos escenas de mariposas entre flores y hojas. Tres imágenes acercan la mirada a gestos pequeños que el paisaje suele dejar en segundo plano.",
      en: "A squirrel eating and two butterfly scenes among flowers and leaves. Three images draw attention to small gestures that the wider landscape often leaves in the background.",
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
