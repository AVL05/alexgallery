"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Calendar, FileText, GraduationCap } from "lucide-react";

const education = [
  {
    title: "Desarrollo de Aplicaciones Web",
    institution: "2º DAW",
    period: "Actual",
    description:
      "Formación en desarrollo de aplicaciones web con tecnologías modernas, bases de datos y arquitectura de software.",
  },
  {
    title: "Sistemas Microinformáticos y Redes",
    institution: "Grado Medio SMR",
    period: "2024",
    description:
      "Formación en sistemas informáticos, redes locales, mantenimiento de equipos y soporte técnico.",
  },
];

const experience = [
  {
    title: "Diseñador Gráfico y Fotógrafo",
    company: "Falla el Molí",
    period: "2023 - 2025",
    description:
      "Gestión de redes sociales, diseño gráfico, fotografía y edición de contenido visual para eventos y comunicación de la falla.",
  },
  {
    title: "Técnico en Prácticas",
    company: "Ayuntamiento de Carlet",
    period: "2024",
    description:
      "Prácticas profesionales en el departamento de informática, brindando soporte técnico y mantenimiento de sistemas.",
  },
];

export function Experience() {
  return (
    <section
      id="experience"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
            Experiencia y Formación
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed px-2">
            Mi trayectoria académica y profesional en el mundo del desarrollo y
            diseño digital
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold">Educación</h3>
            </div>

            {education.map((edu, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xl font-semibold">{edu.title}</h4>
                    <p className="text-primary font-medium">
                      {edu.institution}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{edu.period}</span>
                  </div>

                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    {edu.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold">Experiencia</h3>
            </div>

            {experience.map((exp, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xl font-semibold">{exp.title}</h4>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                  </div>

                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Card className="inline-block p-6 sm:p-8 max-w-2xl mx-4">
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              Mi Currículum
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 text-pretty leading-relaxed">
              Descarga mi CV completo para más detalles sobre mi experiencia y
              formación
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <a href="/curriculum.pdf" download>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Descargar CV
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
