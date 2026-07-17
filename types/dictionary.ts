import type esDictionary from "@/dictionaries/es.json";

export type Locale = "en" | "es";
export type Dictionary = typeof esDictionary;
export type NavDictionary = Dictionary["nav"];
export type HeroDictionary = Dictionary["hero"];
export type HomeDictionary = Dictionary["home"];
export type AboutDictionary = Dictionary["about"];
export type GalleryDictionary = Dictionary["gallery"];
export type PhotoDetailDictionary = Dictionary["photoDetail"];
export type PhotoProcessDictionary = Dictionary["photoProcess"];
export type ContactDictionary = Dictionary["contact"];
export type IntroDictionary = Dictionary["intro"];
