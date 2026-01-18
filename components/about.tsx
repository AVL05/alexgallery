import { Camera, Award, Users, Heart, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  { icon: Camera, label: "Años de Experiencia", value: "10+" },
  { icon: Award, label: "Premios Ganados", value: "25+" },
  { icon: Users, label: "Clientes Satisfechos", value: "200+" },
  { icon: Heart, label: "Proyectos Completados", value: "500+" },
]

export function About() {
  return (
    <section
      id="about"
      className="py-24 md:py-36 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden"
    >
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-accent font-semibold tracking-wider uppercase text-sm">Sobre Mí</span>
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative animate-fade-in-up">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src="/professional-photographer-with-camera-portrait.jpg"
                alt="Fotógrafo profesional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-gradient-to-br from-accent to-accent/50 rounded-3xl -z-10 blur-sm" />
            <div className="absolute -top-8 -left-8 w-40 h-40 border-4 border-accent/30 rounded-3xl -z-10" />
          </div>

          {/* Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-8 text-balance leading-tight">
              Sobre Mi <span className="text-accent">Trabajo</span>
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
              <p className="text-pretty">
                Soy un fotógrafo profesional apasionado por capturar la belleza del mundo que nos rodea. Con más de una
                década de experiencia, me especializo en fotografía de paisajes, fauna y arquitectura.
              </p>
              <p className="text-pretty">
                Mi enfoque combina técnica profesional con una visión artística única, buscando siempre contar historias
                a través de cada imagen. Cada fotografía es una oportunidad para mostrar perspectivas únicas y momentos
                irrepetibles.
              </p>
              <p className="text-pretty">
                He trabajado con clientes de todo el mundo, desde publicaciones editoriales hasta proyectos comerciales,
                siempre manteniendo el compromiso con la excelencia y la creatividad.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-5 md:gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 md:p-8 text-center border-2 hover:border-accent transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card/50 backdrop-blur-sm"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-4">
                    <stat.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
