import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

export function registerMotionPlugins() {
  if (pluginsRegistered || typeof window === "undefined") return;

  gsap.registerPlugin(useGSAP, ScrollTrigger);
  pluginsRegistered = true;
}

registerMotionPlugins();

export { gsap, ScrollTrigger, useGSAP };
