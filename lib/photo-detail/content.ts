import { photos } from "@/lib/gallery-data";
import type { Locale } from "@/types/dictionary";
import type { BasePhoto } from "@/types/photo";

export type LocalizedPhotoContent = Pick<BasePhoto, "title" | "description"> & {
  alt: string;
};

const spanishAlt: Record<number, string> = {
  1: "Tres caballos juntos entre la niebla.",
  3: "Un relámpago cruza las nubes iluminadas al atardecer.",
  4: "Una gaviota posada en una roca sobre el mar.",
  5: "Una ardilla come en el suelo del bosque.",
  6: "Vista de Sevilla con el río, los puentes y las torres.",
  7: "Un cisne descansa sobre el agua junto a su reflejo.",
  11: "Dos mariposas sobre las flores moradas de unos cardos.",
  12: "Una mariposa posada entre hojas de otoño.",
  13: "Un lago tranquilo entre colinas cubiertas de brezo.",
  16: "Una formación rocosa solitaria emerge del océano.",
  17: "Una torre junto a los acantilados de Moher entre la niebla atlántica.",
  19: "Un puente cruza el Duero entre los edificios de Oporto.",
  21: "Un tranvía recorre Oporto de noche junto a una figura que espera.",
  23: "Luces navideñas sobre una calle histórica de Braga.",
  24: "Decoración navideña frente al ayuntamiento de Oporto.",
  26: "La torre de los Clérigos sobre Oporto al caer la tarde.",
  27: "Un músico toca sobre la ciudad de Oporto al atardecer.",
  29: "Una señal dorada del Camino de Santiago entre adoquines.",
  30: "Un valle con bosques y tejados rojos entre montañas.",
  31: "Barcas de colores en un canal de Aveiro.",
  35: "La cascada de la Cola de Caballo cae entre las rocas de Ordesa.",
  37: "Dos pies descalzos sobre la arena mojada junto al mar.",
  41: "Un relámpago ilumina las siluetas de la ciudad de noche.",
  43: "Vías de tren que se prolongan hacia las montañas desde una estación.",
  44: "Un conductor vestido de rojo en una escena urbana de estilo retro.",
  46: "Un músico toca el acordeón frente a los acantilados de Moher.",
  48: "Una puerta dibujada con tiza sobre una pared.",
  49: "Un Mini clásico aparcado entre flores bajo la luz del sol.",
  50: "Una calle de Dublín con fachadas de ladrillo y obras.",
  51: "Una antigua iglesia irlandesa bajo un cielo cubierto.",
  52: "Eclipse solar total con anillo luminoso y efecto diamante sobre un paisaje oscuro.",
  53: "Picos de montaña recortados contra un cielo naranja al atardecer.",
  54: "Un sendero cruza un prado de montaña entre pinos y rocas.",
  55: "Una cumbre escarpada sobre un arroyo de rocas y pinos.",
  56: "Un lago de montaña entre dos laderas rocosas.",
  57: "Un insecto de rayas rojas y negras sobre una hoja verde.",
  58: "Una mariposa posada en el centro de un cardo seco.",
  59: "Trazas de estrellas dibujan arcos sobre un valle nocturno.",
  60: "Un campanario de piedra con reloj visto desde abajo contra el cielo.",
  61: "Dos caballos en una ladera bajo las sillas de un telesilla vacío.",
  62: "Una pasarela de madera serpentea entre los árboles del bosque.",
  63: "Una cresta de montaña emerge entre la niebla y el cielo azul.",
  64: "Una cascada entre pinos y rocas oscuras del bosque.",
  65: "Dos agujas de roca se alzan entre pinos bajo las nubes.",
};

const englishContent: Record<number, LocalizedPhotoContent> = {
  1: { title: "Trio in the mist", description: "Three horses stay close while the mist erases the landscape. Their closeness turns a silent scene into a gesture of companionship.", alt: "Three horses standing together in the mist." },
  3: { title: "The sound of the sky", description: "Lightning crosses the glowing clouds at dusk. For an instant, the storm draws the horizon with a single line of light.", alt: "Lightning crossing glowing storm clouds at dusk." },
  4: { title: "Silence on the rock", description: "A seagull looks out over the drop in absolute calm.", alt: "A seagull perched on a rock above the sea." },
  5: { title: "A feast in the woods", description: "A squirrel stops to eat on the forest floor. For a few seconds, it remains unaware of everything happening around it.", alt: "A squirrel eating on the forest floor." },
  6: { title: "Seville, reflections and heights", description: "The city breathes between river, bridges and towers, where the modern and historic meet.", alt: "Aerial view of Seville, its river, bridges and towers." },
  7: { title: "Serene reflection", description: "A swan rests on the water beside its reflection. The scene draws attention to that pause.", alt: "A swan resting on calm water with its reflection." },
  11: { title: "Wings over purple", description: "Two butterflies visit thistles in full bloom.", alt: "Two butterflies on purple flowering thistles." },
  12: { title: "Autumn wings", description: "A butterfly rests among leaves coloured by the season.", alt: "A butterfly resting on autumn leaves." },
  13: { title: "Where the lake embraces the land", description: "A quiet lake stretches between hills covered in heather.", alt: "A quiet lake between hills covered in heather." },
  16: { title: "The ocean sentinel", description: "A rock formation rises from the water. Its outline holds the attention within the expanse of the sea.", alt: "A solitary rock formation rising from the ocean." },
  17: { title: "Guardians of the cliff", description: "A tower stands at the edge of the Cliffs of Moher as mist covers the Atlantic. The scale of the landscape leaves the building almost lost against the sea.", alt: "A tower and cliffs fading into Atlantic mist." },
  19: { title: "A bridge to the soul of Porto", description: "The bridge crosses the Douro between Porto's two banks. Its structure organizes the view of the city around the river.", alt: "A bridge crossing the Douro through Porto." },
  21: { title: "Last stop: night", description: "A tram crosses Porto at night while a figure waits beside the tracks. The lights and movement capture the city's nocturnal rhythm.", alt: "A tram moving through Porto at night." },
  23: { title: "Light, history and Christmas spirit", description: "Christmas lights stretch along a Braga street. The decorations connect the facades and lead the eye into the scene.", alt: "Christmas lights illuminating a historic street in Braga." },
  24: { title: "Between spirals and chimes", description: "Christmas brings past and future together outside Porto City Hall.", alt: "Christmas lights and architecture outside Porto City Hall." },
  26: { title: "The tower watching over dreams", description: "Clerigos Tower rises over Porto as the day fades in soft light.", alt: "Clerigos Tower above Porto in fading daylight." },
  27: { title: "Where the sky meets the city", description: "A musician accompanies sunset in Porto as the city says goodbye to the day.", alt: "A musician performing above Porto at sunset." },
  29: { title: "The golden arrow among city footsteps", description: "A Camino de Santiago marker points the way between cobbles and distant views.", alt: "A golden Camino de Santiago marker set in city cobbles." },
  30: { title: "Shelter among mountains", description: "A hidden valley breathes between forests and red roofs under soft mountain light.", alt: "A valley with forest, red roofs and mountains." },
  31: { title: "Aveiro, the Portuguese Venice", description: "Moliceiro boats travel through Aveiro between bridges, facades and winter light.", alt: "Colourful boats on an Aveiro canal." },
  35: { title: "The murmur of Ordesa", description: "The Cola de Caballo waterfall drops between rock and spray at the far end of the Ordesa valley. The water fills the scene and makes the rest of the landscape seem to pause.", alt: "The Cola de Caballo waterfall in Ordesa." },
  37: { title: "Where the path ends", description: "Two bare feet rest on wet sand beside the sea. The tide leaves a brief reflection before reshaping the shore again.", alt: "Bare feet on wet sand beside the sea." },
  41: { title: "Electric cut over the city", description: "Lightning tears across the night sky, briefly illuminating the urban silhouettes below.", alt: "Lightning over city silhouettes at night." },
  43: { title: "The station of silence", description: "Tracks extend towards the mountains from a quiet station, inviting an inner and outward journey.", alt: "Railway tracks leading from a quiet station towards mountains." },
  44: { title: "Red over asphalt", description: "A retro driver cuts through the city with the attitude of an action-film scene.", alt: "A retro-styled driver in red on an urban road." },
  46: { title: "The accordion and the abyss", description: "A lone musician plays accordion at the Cliffs of Moher. I came across him unexpectedly during the walk, and his music completely changed the silence of the place.", alt: "A musician playing accordion at the Cliffs of Moher." },
  48: { title: "Imaginary entrance", description: "A chalk-drawn door turns an ordinary wall into a threshold to possibility.", alt: "A doorway drawn in chalk on a wall." },
  49: { title: "Flowers, sun and a classic engine", description: "A classic Mini appears among flowers in the summer light. The colour of the car and the garden create a scene that is hard to overlook.", alt: "A classic Mini parked among flowers in sunlight." },
  50: { title: "Between brick and change", description: "A Dublin street moves between history, construction and everyday life.", alt: "A brick-lined Dublin street under construction." },
  51: { title: "Whispers of the monastery", description: "An old Irish church rises under dense skies, holding centuries of silence.", alt: "An old Irish church beneath dense clouds." },
  52: { title: "12.08.2026 — Solar eclipse", description: "The last thread of light draws a ring around the Moon during the total solar eclipse.", alt: "Total solar eclipse showing a bright ring and diamond effect above a dark landscape." },
  53: { title: "Last light over the peaks", description: "The sun disappears behind the range, leaving the peaks outlined against a glowing sky.", alt: "Mountain peaks silhouetted against an orange sunset sky." },
  54: { title: "Path towards the heights", description: "The trail crosses a high mountain meadow among pines, rock and early light.", alt: "A trail crossing a sunlit mountain meadow among pine trees." },
  55: { title: "The peak above the stream", description: "A sharp peak dominates the passage as water moves between rock walls and pines.", alt: "A sharp mountain peak above a rocky stream and pine forest." },
  56: { title: "The lake between two slopes", description: "Water fills the centre of the pass as the slopes descend towards it from both sides.", alt: "An alpine lake between two steep rocky slopes." },
  57: { title: "Small woodland inhabitant", description: "A red-and-black striped insect stands out against the soft green leaves.", alt: "A red-and-black striped insect resting on a green leaf." },
  58: { title: "Shelter among thorns", description: "A butterfly rests at the centre of a dry thistle, surrounded by the mountain's rough textures.", alt: "A butterfly resting on the centre of a dry thistle." },
  59: { title: "The sky in motion", description: "Stars draw arcs above the valley during a long night exposure.", alt: "Star trails crossing the night sky above a mountain valley." },
  60: { title: "The hour among the clouds", description: "The stone bell tower rises towards a clock outlined by light and clouds.", alt: "A stone bell tower and clock seen from below against the sky." },
  61: { title: "Beneath the empty chairs", description: "Two horses stay together on the slope beneath the motionless chairlift.", alt: "Two horses on a mountain slope beneath an empty chairlift." },
  62: { title: "The woodland boardwalk", description: "A wooden boardwalk curves among trunks, moss and the subdued light of the forest.", alt: "A wooden boardwalk curving through a dense forest." },
  63: { title: "The mountain appears", description: "The mist parts for a moment, revealing the mountain ridge against the blue sky.", alt: "A mountain ridge emerging from mist under a blue sky." },
  64: { title: "Water among the pines", description: "A waterfall drops with force among vegetation and the forest's dark rock.", alt: "A waterfall framed by dense pine forest and dark rock." },
  65: { title: "Teeth of stone", description: "Two rock needles emerge among the pines and cut their profile against the clouds.", alt: "Two jagged rock needles rising above a pine forest." },
};

export function getLocalizedPhotoContent(photo: BasePhoto, locale: Locale): LocalizedPhotoContent {
  if (locale === "en" && englishContent[photo.id]) return englishContent[photo.id];
  return { title: photo.title, description: photo.description, alt: spanishAlt[photo.id] || photo.title };
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
