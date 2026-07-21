import { getPublishedSeries, getUnassignedPhotoIds } from "@/lib/series/selectors";
import type { HomeCuration } from "@/lib/home/curation";

export const homeExperienceSections = [
  "hero",
  "manifesto",
  "featuredStory",
  "series",
  "expansivePhoto",
  "visualChapters",
  "selectedWork",
  "archive",
  "contact",
  "closing",
] as const;

export type HomeExperienceSection = (typeof homeExperienceSections)[number];

const experienceSectionOrder: readonly HomeExperienceSection[] = [
  "hero",
  "manifesto",
  "featuredStory",
  "series",
  "expansivePhoto",
  "selectedWork",
  "archive",
  "contact",
];

const requiredExperienceSections: readonly HomeExperienceSection[] = [
  "hero",
  "manifesto",
  "featuredStory",
  "series",
  "selectedWork",
  "archive",
  "contact",
];

const hiddenExperienceSections: readonly HomeExperienceSection[] = [
  "visualChapters",
  "closing",
];

export const homeExperienceConfig = {
  sectionOrder: experienceSectionOrder,
  requiredSections: requiredExperienceSections,
  hiddenSections: hiddenExperienceSections,
  selectedWorkLimit: 4,
  selectedWorkOnlyUnassigned: true,
  showArchivePreview: false,
  featuredSeriesId: "porto-river-night",
  compactMobileSections: true,
  prefetch: {
    featuredSeries: true,
    secondarySeries: false,
    selectedWork: false,
    archiveItems: false,
  },
} as const satisfies {
  sectionOrder: readonly HomeExperienceSection[];
  requiredSections: readonly HomeExperienceSection[];
  hiddenSections: readonly HomeExperienceSection[];
  selectedWorkLimit: number;
  selectedWorkOnlyUnassigned: boolean;
  showArchivePreview: boolean;
  featuredSeriesId: string;
  compactMobileSections: boolean;
  prefetch: {
    featuredSeries: boolean;
    secondarySeries: boolean;
    selectedWork: boolean;
    archiveItems: boolean;
  };
};

export function getHomeSectionPosition(section: HomeExperienceSection) {
  const index = homeExperienceConfig.sectionOrder.indexOf(section);
  return index < 0 ? null : {
    current: index + 1,
    total: homeExperienceConfig.sectionOrder.length,
  };
}

export function orderHomeSeries<T extends { id: string }>(series: readonly T[]) {
  return [...series].sort((a, b) => {
    if (a.id === homeExperienceConfig.featuredSeriesId) return -1;
    if (b.id === homeExperienceConfig.featuredSeriesId) return 1;
    return 0;
  });
}

export function validateHomeExperience(curation: HomeCuration): string[] {
  const errors: string[] = [];
  const order = homeExperienceConfig.sectionOrder;
  const duplicateSections = order.filter((section, index) => order.indexOf(section) !== index);

  for (const section of new Set(duplicateSections)) {
    errors.push(`La sección ${section} aparece más de una vez en sectionOrder.`);
  }
  for (const section of homeExperienceConfig.requiredSections) {
    if (!order.includes(section)) errors.push(`Falta la sección obligatoria ${section}.`);
  }
  for (const section of homeExperienceConfig.hiddenSections) {
    if (order.includes(section)) errors.push(`La sección oculta ${section} sigue presente en sectionOrder.`);
  }
  if (order[0] !== "hero") errors.push("Hero debe ser la primera sección de la home.");
  if (homeExperienceConfig.selectedWorkLimit < 3 || homeExperienceConfig.selectedWorkLimit > 4) {
    errors.push("Selected Work debe limitarse a tres o cuatro fotografías.");
  }
  if (curation.selectedPhotoIds.length > homeExperienceConfig.selectedWorkLimit) {
    errors.push(`Selected Work supera el límite de ${homeExperienceConfig.selectedWorkLimit} fotografías.`);
  }

  const publishedSeries = getPublishedSeries();
  if (!publishedSeries.some((series) => series.id === homeExperienceConfig.featuredSeriesId)) {
    errors.push(`La serie destacada ${homeExperienceConfig.featuredSeriesId} no está publicada.`);
  }
  if (homeExperienceConfig.selectedWorkOnlyUnassigned) {
    const unassignedIds = new Set(getUnassignedPhotoIds(curation.selectedPhotoIds));
    for (const id of curation.selectedPhotoIds) {
      if (!unassignedIds.has(id)) errors.push(`Selected Work usa photo-${id}, que pertenece a una serie publicada.`);
    }
  }

  return errors;
}

export function assertValidHomeExperience(curation: HomeCuration) {
  const errors = validateHomeExperience(curation);
  if (errors.length > 0) throw new Error(`Configuración de experiencia inválida:\n\n${errors.join("\n\n")}`);
}
