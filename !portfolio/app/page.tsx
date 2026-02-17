import { About } from "@/components/about";
import { AnimatedBackground } from "@/components/animated-background";
import { Hero } from "@/components/hero";
import { LoadingScreen } from "@/components/loading-screen";
import { Navigation } from "@/components/navigation";
import { Skills } from "@/components/skills";
import dynamic from "next/dynamic";

const Projects = dynamic(() =>
  import("@/components/projects").then((mod) => mod.Projects),
);
const Photography = dynamic(() =>
  import("@/components/photography").then((mod) => mod.Photography),
);
const Experience = dynamic(() =>
  import("@/components/experience").then((mod) => mod.Experience),
);
const Contact = dynamic(() =>
  import("@/components/contact").then((mod) => mod.Contact),
);

export const metadata = {
  title: "Inicio",
  description:
    "Portafolio de Alex Vicente López — Desarrollador Web, Fotógrafo y Diseñador Digital.",
};

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <LoadingScreen />
      <AnimatedBackground />

      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Photography />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
