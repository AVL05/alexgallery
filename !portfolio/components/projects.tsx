"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  scrollRevealVariants,
  staggerChildrenVariants,
  useScrollReveal,
} from "@/hooks/useScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const smallImageProjects = [
  "Llibret Falla el Molí 24/25",
  "Web de XML",
  "Cartel Cena de Proclamación",
  "XIX Concurso",
  "XX Concurso",
  "XXI Concurso",
];

const projects = [
  {
    title: "Llibret Falla el Molí 24/25",
    description:
      "Diseño editorial completo del llibret de la Falla el Molí para la temporada 2024/2025. Proyecto integral que incluye maquetación, diseño gráfico y preparación para impresión.",
    image: "/projects/Falla.svg",
    technologies: ["Adobe InDesign", "Photoshop", "Illustrator"],
    category: "Diseño Gráfico",
    link: "/projects/LLIBRET 24-25.pdf",
  },
  {
    title: "Web de XML",
    description:
      "Aplicación web educativa diseñada para aprender a usar XML en 4 semanas. Incluye tutoriales interactivos, ejemplos prácticos y ejercicios progresivos.",
    image: "/projects/favicon.ico",
    technologies: ["HTML5", "CSS3", "JavaScript", "XML"],
    category: "Desarrollo Web",
    link: "https://avl05.github.io/web-xml-alex/",
    github: "https://github.com/avl05/web-xml-alex",
  },
  {
    title: "Cartel Cena de Proclamación",
    description:
      "Diseño de cartel para la invitación a la cena de proclamación de la Falla el Molí 24/25. Diseño visual impactante que captura la esencia del evento.",
    image: "/projects/Falla.svg",
    technologies: ["Adobe Illustrator", "Photoshop"],
    category: "Diseño Gráfico",
    link: "/projects/Cartel proclamacion (JPG).jpg",
  },
  {
    title: "Pancarta FM 24/25",
    description: "Diseño de una pancarta para la FM (Irene)",
    image: "/projects/Pancarta_Irene.jpg",
    technologies: ["Photoshop", "Lightroom"],
    category: "Diseño Gráfico",
    link: "/projects/Pancarta_Irene.jpg",
  },
  {
    title: "Pancarta FMi 24/25",
    description: "Diseño de una pancarta para la FMi (Claudia)",
    image: "/projects/Pancarta_Claudia.jpg",
    technologies: ["Photoshop", "Lightroom"],
    category: "Diseño Gráfico",
    link: "/projects/Pancarta_Claudia.jpg",
  },
  {
    title: "XIX Concurso",
    description: "Diseño del cartel de la Falla el Molí por el XIX Concurso",
    image: "/projects/XIX Concurso.png",
    technologies: ["Photoshop", "Lightroom"],
    category: "Diseño Gráfico",
    link: "/projects/XIX Concurso.png",
  },
  {
    title: "XX Concurso",
    description: "Diseño del cartel de la Falla el Molí por el XX Concurso",
    image: "/projects/XX Concurso.png",
    technologies: ["Photoshop", "Lightroom"],
    category: "Diseño Gráfico",
    link: "/projects/XX Concurso.png",
  },
  {
    title: "XXI Concurso",
    description: "Diseño del cartel de la Falla el Molí por el XXI Concurso",
    image: "/projects/XXI Concurso.png",
    technologies: ["Photoshop", "Lightroom"],
    category: "Diseño Gráfico",
    link: "/projects/XXI Concurso.png",
  },
  {
    title: "Dulces Navideños",
    description:
      "Página web hecha con Vue, para el encargo de dulces navideños",
    image: "/projects/aitanamora.png",
    technologies: ["Vue"],
    category: "Desarrollo Web",
    link: "https://aitanamora.vercel.app/",
    github: "https://github.com/AVL05/Dulces",
  },
  {
    title: "API Reservas Hotel",
    description:
      "Sistema de gestión hotelera completo con API RESTful, panel de administración seguro y frontend moderno (SPA). Incluye autenticación, gestión de reservas y base de datos optimizada. Hecho por Gabi y Alex",
    image: "/projects/api-hotel-cover.png",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
    category: "Desarrollo Web",
    link: "/projects/Demo_API_Hotel.mp4",
    github: "https://github.com/avl05/API_Hotel",
  },
  {
    title: "El Fogón",
    description:
      "Sitio web moderno y responsivo para un restaurante mediterráneo. Desarrollado con HTML5 semántico y Tailwind CSS v4, ofreciendo una experiencia visual atractiva y fluida.",
    image: "/projects/el-fogon.png",
    technologies: ["Tailwind CSS", "JavaScript", "HTML5"],
    category: "Desarrollo Web",
    link: "https://prweb02.netlify.app/",
    github: "https://github.com/AVL05/PRWEB02",
  },
];

export function Projects() {
  const { ref, isInView } = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = ["Todos", "Diseño Gráfico", "Desarrollo Web"];

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === "Todos") return true;
    return project.category === activeCategory;
  });

  // Función para determinar si el enlace debe abrir en nueva pestaña
  const shouldOpenInNewTab = (link: string) => {
    return link.startsWith("http");
  };

  // Función para obtener el texto del botón según el tipo de enlace
  const getButtonText = (link: string) => {
    if (link.includes(".pdf")) return "Ver PDF";
    if (link.includes(".jpg") || link.includes(".png")) return "Ver Imagen";
    if (link.startsWith("http")) return "Ver Sitio";
    return "Ver Proyecto";
  };

  // Función para obtener color basado en categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Desarrollo Web":
        return "from-blue-500 to-cyan-500";
      case "Diseño Gráfico":
        return "from-orange-500 to-red-500";
      case "Fotografía":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <section
      id="projects"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-primary/5" />
      <motion.div
        className="absolute top-1/4 -right-32 w-96 h-96 bg-linear-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 -left-32 w-80 h-80 bg-linear-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"
        animate={{
          rotate: [360, 180, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <motion.div
          className="space-y-4 mb-12 text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerChildrenVariants}
        >
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance bg-linear-to-r from-foreground via-primary to-accent bg-clip-text text-transparent"
            variants={scrollRevealVariants}
          >
            Mis Proyectos
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed px-2"
            variants={scrollRevealVariants}
          >
            Una selección de mis trabajos recientes en desarrollo web, diseño
            gráfico y fotografía
          </motion.p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={`transition-all duration-300 ${
                activeCategory === category
                  ? "shadow-lg scale-105"
                  : "hover:bg-primary/10"
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
          variants={staggerChildrenVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.title}
                variants={scrollRevealVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm border-2 hover:border-primary/20 h-full flex flex-col">
                  {/* Image container with enhanced effects */}
                  <div
                    className={`relative aspect-video overflow-hidden bg-muted group-hover:bg-muted/80 transition-colors duration-500 ${
                      smallImageProjects.includes(project.title)
                        ? "flex items-center justify-center"
                        : ""
                    }`}
                  >
                    {/* Overlay gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-linear-to-br ${getCategoryColor(
                        project.category,
                      )} opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10`}
                    />

                    {/* Image */}
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className={`transition-all duration-500 relative z-0 ${
                        smallImageProjects.includes(project.title)
                          ? "object-contain p-8"
                          : "object-cover"
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Category badge */}
                    <motion.div
                      className="absolute top-4 right-4 z-20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge
                        variant="secondary"
                        className={`bg-linear-to-r ${getCategoryColor(
                          project.category,
                        )} text-white border-0 backdrop-blur-sm font-medium px-3 py-1`}
                      >
                        {project.category}
                      </Badge>
                    </motion.div>

                    {/* Hover overlay */}
                    <motion.div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center">
                      <motion.div
                        className="text-white text-center"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <ExternalLink className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Ver Proyecto</p>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4 grow flex flex-col">
                    <motion.h3
                      className="text-2xl font-semibold group-hover:text-primary transition-colors duration-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ delay: 0.4 }}
                    >
                      {project.title}
                    </motion.h3>

                    <motion.p
                      className="text-muted-foreground text-pretty leading-relaxed grow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ delay: 0.5 }}
                    >
                      {project.description}
                    </motion.p>

                    {/* Technologies */}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ delay: 0.6 }}
                    >
                      {project.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={
                            isInView
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 0.8 }
                          }
                          transition={{
                            delay: 0.7 + techIndex * 0.05,
                          }}
                        >
                          <Badge
                            variant="outline"
                            className="hover:bg-primary/10 hover:border-primary/30 transition-colors"
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Action button */}
                    <motion.div
                      className="pt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className={`group/btn bg-linear-to-r ${getCategoryColor(
                            project.category,
                          )} text-white border-0 hover:shadow-lg transition-all duration-300`}
                        >
                          <a
                            href={project.link}
                            target={
                              shouldOpenInNewTab(project.link)
                                ? "_blank"
                                : "_self"
                            }
                            rel={
                              shouldOpenInNewTab(project.link)
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {getButtonText(project.link)}
                            </div>
                          </a>
                        </Button>

                        {project.github && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-zinc-800 text-white border-0 hover:bg-zinc-700 hover:shadow-lg transition-all duration-300"
                          >
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="flex items-center">
                                <Github className="h-4 w-4 mr-2" />
                                GitHub
                              </div>
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
