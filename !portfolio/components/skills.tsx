"use client";

import { Card } from "@/components/ui/card";
import {
  scrollRevealVariants,
  staggerChildrenVariants,
  useScrollReveal,
} from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Code2, Languages, Palette } from "lucide-react";

const skillCategories = [
  {
    icon: Code2,
    title: "Tecnologías",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    skills: [
      { name: "HTML", level: "" },
      { name: "CSS", level: "" },
      { name: "JavaScript", level: "" },
      { name: "React", level: "" },
      { name: "Vue", level: "" },
      { name: "Tailwind", level: "" },
      { name: "Bootstrap", level: "" },
      { name: "PHP", level: "" },
      { name: "Laravel", level: "" },
    ],
  },
  {
    icon: Palette,
    title: "Adobe Creative Suite",
    color: "from-pink-500 to-purple-500",
    bgColor: "bg-pink-500/10",
    skills: [
      { name: "Photoshop", level: "Edición y retoque fotográfico" },
      { name: "Illustrator", level: "Diseño vectorial" },
      { name: "InDesign", level: "Maquetación editorial" },
      { name: "Premiere", level: "Edición de vídeo" },
      { name: "Lightroom", level: "Edición y retoque fotográfico" },
    ],
  },
  {
    icon: Languages,
    title: "Idiomas",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    skills: [
      { name: "Español", level: "Nativo" },
      { name: "Valenciano", level: "Nativo" },
      { name: "Inglés", level: "Intermedio" },
    ],
  },
];

export function Skills() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      id="skills"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-accent/5 to-secondary/5" />
      <motion.div
        className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
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
            Habilidades
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed px-2"
            variants={scrollRevealVariants}
          >
            Tecnologías, herramientas e idiomas que domino para crear soluciones
            digitales completas
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          variants={staggerChildrenVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div key={category.title} variants={scrollRevealVariants}>
              <Card className="p-6 h-full relative overflow-hidden group hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border-2 hover:border-primary/20">
                {/* Card background gradient */}
                <motion.div
                  className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Header */}
                  <motion.div
                    className="flex items-center gap-3 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ delay: categoryIndex * 0.2 + 0.3 }}
                  >
                    <div
                      className={`p-3 ${category.bgColor} rounded-lg relative overflow-hidden`}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-linear-to-r ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      />
                      <category.icon className="h-6 w-6 text-primary relative z-10" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                  </motion.div>

                  {/* Skills */}
                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          isInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{
                          delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5,
                        }}
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium group-hover:text-primary transition-colors duration-300">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {skill.level}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
