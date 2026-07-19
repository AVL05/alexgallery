import { photos } from "@/lib/gallery-data";
import {
  homeChapterOrder,
  type HomeCuration,
  type HomeChapterCategory,
} from "@/lib/home/curation";
import type { ImagesData } from "@/types/photo";

type HomeCurationSection = {
  name: string;
  ids: readonly number[];
};

function getCurationSections(curation: HomeCuration): HomeCurationSection[] {
  return [
    { name: "hero", ids: [curation.heroPhotoId] },
    { name: "featuredStory", ids: [curation.featuredPhotoId] },
    { name: "expansivePhoto", ids: [curation.expansivePhotoId] },
    ...homeChapterOrder.map((category) => ({
      name: `chapters.${category}`,
      ids: [curation.chapterPhotoIds[category]],
    })),
    { name: "selectedWork", ids: curation.selectedPhotoIds },
    { name: "archiveIndex", ids: curation.archiveIndexPhotoIds },
  ];
}

function formatAppearanceError(id: number, sections: readonly string[]) {
  return [
    `photo-${id} aparece en:`,
    ...sections.map((section) => `- ${section}`),
    "",
    "Máximo permitido en home: 1",
  ].join("\n");
}

export function validateHomeCuration(
  curation: HomeCuration,
  imagesData?: ImagesData,
): string[] {
  const errors: string[] = [];
  const catalogById = new Map(photos.map((photo) => [photo.id, photo]));
  const imageIds = new Set(imagesData?.images.map((image) => Number(image.id)) ?? []);
  const sections = getCurationSections(curation);

  if (imagesData && !imageIds.has(curation.heroPhotoId)) {
    errors.push(`hero usa photo-${curation.heroPhotoId}, ausente en images-data.json.`);
  }

  for (const section of sections.filter(({ name }) => name !== "hero")) {
    const duplicates = section.ids.filter(
      (id, index) => section.ids.indexOf(id) !== index,
    );
    for (const id of new Set(duplicates)) {
      errors.push(`photo-${id} está duplicada dentro de ${section.name}.`);
    }
    for (const id of section.ids) {
      if (!catalogById.has(id)) {
        errors.push(`${section.name} usa photo-${id}, ausente en el catálogo.`);
      }
    }
  }

  const appearances = new Map<number, string[]>();
  for (const section of sections) {
    for (const id of new Set(section.ids)) {
      appearances.set(id, [...(appearances.get(id) ?? []), section.name]);
    }
  }
  for (const [id, usedBy] of appearances) {
    if (usedBy.length > 1) errors.push(formatAppearanceError(id, usedBy));
  }

  for (const category of homeChapterOrder) {
    const id = curation.chapterPhotoIds[category];
    if (!id) {
      errors.push(`Falta fotografía para chapters.${category}.`);
      continue;
    }
    const photo = catalogById.get(id);
    if (photo && photo.category !== category) {
      errors.push(
        `chapters.${category} usa photo-${id}, cuya categoría es ${photo.category}.`,
      );
    }
  }

  const configuredChapterKeys = Object.keys(curation.chapterPhotoIds);
  for (const key of configuredChapterKeys) {
    if (!homeChapterOrder.includes(key as HomeChapterCategory)) {
      errors.push(`Categoría de capítulo incorrecta: ${key}.`);
    }
  }

  if (curation.selectedPhotoIds.length < 5) {
    errors.push("Selected Work debe contener al menos cinco fotografías.");
  }
  if (curation.selectedPhotoIds.length > 6) {
    errors.push("Selected Work no puede contener más de seis fotografías.");
  }

  return errors;
}

export function assertValidHomeCuration(
  curation: HomeCuration,
  imagesData?: ImagesData,
) {
  const errors = validateHomeCuration(curation, imagesData);
  if (errors.length > 0) {
    throw new Error(`Configuración de home inválida:\n\n${errors.join("\n\n")}`);
  }
}
