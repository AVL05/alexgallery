import type { BasePhoto } from "@/types/photo";
import type { PhotoSeries } from "@/lib/series/types";

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePhotoSeries(
  seriesList: readonly PhotoSeries[],
  catalog: readonly Pick<BasePhoto, "id">[],
) {
  const errors: string[] = [];
  const catalogIds = new Set(catalog.map((photo) => photo.id));
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const membership = new Map<number, string[]>();

  for (const series of seriesList) {
    if (ids.has(series.id)) errors.push(`ID de serie duplicado: "${series.id}".`);
    ids.add(series.id);
    if (slugs.has(series.slug)) errors.push(`Slug de serie duplicado: "${series.slug}".`);
    slugs.add(series.slug);
    if (!validSlug.test(series.slug)) errors.push(`La serie "${series.id}" usa el slug inválido "${series.slug}".`);
    if (!series.title.es.trim() || !series.title.en.trim()) errors.push(`La serie "${series.id}" no tiene título ES y EN.`);
    if (series.status === "published" && (!series.description.es.trim() || !series.description.en.trim())) errors.push(`La serie publicada "${series.id}" no tiene descripción ES y EN.`);
    if (series.photoIds.length < 3) errors.push(`La serie "${series.id}" contiene menos de tres fotografías.`);
    if (!catalogIds.has(series.coverPhotoId)) errors.push(`La portada ${series.coverPhotoId} de "${series.id}" no existe.`);
    if (!series.photoIds.includes(series.coverPhotoId)) errors.push(`La portada ${series.coverPhotoId} no está incluida en "${series.id}".`);

    const seen = new Set<number>();
    for (const photoId of series.photoIds) {
      if (!catalogIds.has(photoId)) errors.push(`La serie "${series.id}" contiene la fotografía inexistente ${photoId}.`);
      if (seen.has(photoId)) errors.push(`La serie "${series.id}" contiene photo-${photoId} dos veces.`);
      seen.add(photoId);
      membership.set(photoId, [...(membership.get(photoId) ?? []), series.id]);
    }

    const blockIds = series.blocks.flatMap((block) => [...block.photoIds]);
    for (const block of series.blocks) {
      const expected = block.layout === "diptych" ? 2 : 1;
      if (block.photoIds.length !== expected) errors.push(`El bloque ${block.layout} de "${series.id}" debe contener ${expected} fotografía${expected === 1 ? "" : "s"}.`);
    }
    if (blockIds.join(",") !== series.photoIds.join(",")) errors.push(`Los bloques de "${series.id}" no respetan el orden fotográfico declarado.`);
  }

  for (const [photoId, seriesIds] of membership) {
    if (seriesIds.length > 1) errors.push(`photo-${photoId} aparece en demasiadas series: ${seriesIds.join(", ")}.`);
  }
  return errors;
}

export function assertValidPhotoSeries(
  seriesList: readonly PhotoSeries[],
  catalog: readonly Pick<BasePhoto, "id">[],
) {
  const errors = validatePhotoSeries(seriesList, catalog);
  if (errors.length) throw new Error(`Configuración de series inválida:\n- ${errors.join("\n- ")}`);
}
