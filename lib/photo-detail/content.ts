import { photos } from "@/lib/gallery-data";
import type { Locale } from "@/types/dictionary";
import type { BasePhoto } from "@/types/photo";

export type LocalizedPhotoContent = Pick<BasePhoto, "title" | "description"> & {
  alt: string;
};

const englishContent: Record<number, LocalizedPhotoContent> = {
  1: { title: "Trio in the mist", description: "Three horses, a tender moment held in the mist.", alt: "Three horses standing together in the mist." },
  3: { title: "The sound of the sky", description: "Lightning crosses the glowing clouds like an electric cry through the dusk.", alt: "Lightning crossing glowing storm clouds at dusk." },
  4: { title: "Silence on the rock", description: "A seagull looks out over the drop in absolute calm.", alt: "A seagull perched on a rock above the sea." },
  5: { title: "A feast in the woods", description: "A squirrel savours its treasure on the forest floor.", alt: "A squirrel eating on the forest floor." },
  6: { title: "Seville, reflections and heights", description: "The city breathes between river, bridges and towers, where the modern and historic meet.", alt: "Aerial view of Seville, its river, bridges and towers." },
  7: { title: "Serene reflection", description: "A swan rests with the stillness of a poem.", alt: "A swan resting on calm water with its reflection." },
  11: { title: "Wings over purple", description: "Two butterflies visit thistles in full bloom.", alt: "Two butterflies on purple flowering thistles." },
  12: { title: "Autumn wings", description: "A butterfly rests among leaves coloured by the season.", alt: "A butterfly resting on autumn leaves." },
  13: { title: "Where the lake embraces the land", description: "A quiet lake stretches between hills covered in heather.", alt: "A quiet lake between hills covered in heather." },
  16: { title: "The ocean sentinel", description: "A solitary rock formation rises from the water, an ancient guardian against time.", alt: "A solitary rock formation rising from the ocean." },
  17: { title: "Guardians of the cliff", description: "A lone tower looks over the edge as the cliffs fade into the Atlantic mist.", alt: "A tower and cliffs fading into Atlantic mist." },
  19: { title: "A bridge to the soul of Porto", description: "Porto's bridge joins history and modern life above the Douro.", alt: "A bridge crossing the Douro through Porto." },
  21: { title: "Last stop: night", description: "A tram crosses Porto at night while the city breathes between shadow and encounter.", alt: "A tram moving through Porto at night." },
  23: { title: "Light, history and Christmas spirit", description: "Christmas turns Braga into a passage of light and tradition.", alt: "Christmas lights illuminating a historic street in Braga." },
  24: { title: "Between spirals and chimes", description: "Christmas brings past and future together outside Porto City Hall.", alt: "Christmas lights and architecture outside Porto City Hall." },
  26: { title: "The tower watching over dreams", description: "Clerigos Tower rises over Porto as the day fades in soft light.", alt: "Clerigos Tower above Porto in fading daylight." },
  27: { title: "Where the sky meets the city", description: "A musician accompanies sunset in Porto as the city says goodbye to the day.", alt: "A musician performing above Porto at sunset." },
  29: { title: "The golden arrow among city footsteps", description: "A Camino de Santiago marker points the way between cobbles and distant views.", alt: "A golden Camino de Santiago marker set in city cobbles." },
  30: { title: "Shelter among mountains", description: "A hidden valley breathes between forests and red roofs under soft mountain light.", alt: "A valley with forest, red roofs and mountains." },
  31: { title: "Aveiro, the Portuguese Venice", description: "Moliceiro boats travel through Aveiro between bridges, facades and winter light.", alt: "Colourful boats on an Aveiro canal." },
  35: { title: "The murmur of Ordesa", description: "The Cola de Caballo waterfall in Ordesa invites silence and contemplation among rock and spray.", alt: "The Cola de Caballo waterfall in Ordesa." },
  37: { title: "Where the path ends", description: "Two bare feet meet the wet sand in a quiet moment between land and sea.", alt: "Bare feet on wet sand beside the sea." },
  41: { title: "Electric cut over the city", description: "Lightning tears across the night sky, briefly illuminating the urban silhouettes below.", alt: "Lightning over city silhouettes at night." },
  43: { title: "The station of silence", description: "Tracks extend towards the mountains from a quiet station, inviting an inner and outward journey.", alt: "Railway tracks leading from a quiet station towards mountains." },
  44: { title: "Red over asphalt", description: "A retro driver cuts through the city with the attitude of an action-film scene.", alt: "A retro-styled driver in red on an urban road." },
  46: { title: "The accordion and the abyss", description: "A lone musician fills the Cliffs of Moher with music, where land meets sky.", alt: "A musician playing accordion at the Cliffs of Moher." },
  48: { title: "Imaginary entrance", description: "A chalk-drawn door turns an ordinary wall into a threshold to possibility.", alt: "A doorway drawn in chalk on a wall." },
  49: { title: "Flowers, sun and a classic engine", description: "A classic Mini pauses among flowers and light, recalling summer afternoons and retro elegance.", alt: "A classic Mini parked among flowers in sunlight." },
  50: { title: "Between brick and change", description: "A Dublin street moves between history, construction and everyday life.", alt: "A brick-lined Dublin street under construction." },
  51: { title: "Whispers of the monastery", description: "An old Irish church rises under dense skies, holding centuries of silence.", alt: "An old Irish church beneath dense clouds." },
};

export function getLocalizedPhotoContent(photo: BasePhoto, locale: Locale): LocalizedPhotoContent {
  if (locale === "en" && englishContent[photo.id]) return englishContent[photo.id];
  return { title: photo.title, description: photo.description, alt: photo.description || photo.title };
}

export function getLocalizedPhoto(id: number, locale: Locale) {
  const photo = photos.find((entry) => entry.id === id);
  if (!photo) return null;
  return { ...photo, ...getLocalizedPhotoContent(photo, locale) };
}

export function getLocalizedPhotos(locale: Locale) {
  return photos.map((photo) => ({ ...photo, ...getLocalizedPhotoContent(photo, locale) }));
}

export const translatedPhotoIds = Object.freeze(Object.keys(englishContent).map(Number));
