'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Copyright,
  Scale,
  Download,
  Share2,
  Award,
} from 'lucide-react'

export default function PoliticaUso() {
  return (
    <main className="min-h-screen py-20 px-6 lg:px-12 relative z-10">
      <div className="container mx-auto max-w-4xl relative z-10 bg-background/95 backdrop-blur-sm rounded-2xl p-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-accent/10 rounded-lg">
              <Copyright className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter font-serif">
              Política de Uso
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Términos y condiciones de uso de las fotografías de Alex Vicente
          </p>
        </motion.div>

        {/* Copyright Notice */}
        <motion.div
          className="glass p-8 rounded-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-start gap-4">
            <Award className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4 font-serif">
                © Copyright
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Todas las fotografías mostradas en esta galería son propiedad
                intelectual de <strong>Alex Vicente</strong>y están protegidas
                por las leyes de copyright internacionales. Cada imagen contiene
                metadatos de copyright embebidos con la información del autor.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Restrictions */}
        <motion.div
          className="space-y-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-lg flex-shrink-0">
              <Download className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 font-serif">
                Uso No Autorizado
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Queda <strong>estrictamente prohibido</strong>:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-muted-foreground">
                <li>
                  Descargar, copiar o reproducir las imágenes sin autorización
                  expresa
                </li>
                <li>Uso comercial sin licencia</li>
                <li>Modificación, edición o manipulación de las fotografías</li>
                <li>Redistribución o publicación en otros medios</li>
                <li>Eliminación o alteración de los metadatos de copyright</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
              <Scale className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 font-serif">
                Uso Permitido
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Se permite <strong>únicamente</strong>:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-muted-foreground">
                <li>Visualización personal en este sitio web</li>
                <li>
                  Compartir el enlace al portfolio (no las imágenes
                  directamente)
                </li>
                <li>Uso con licencia previa y por escrito del autor</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Licensing */}
        <motion.div
          className="glass p-8 rounded-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <Share2 className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4 font-serif">
                Licencias Disponibles
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Si estás interesado en utilizar alguna fotografía para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Proyectos comerciales</li>
                <li>Publicaciones editoriales</li>
                <li>Uso en redes sociales o web</li>
                <li>Material promocional o publicitario</li>
                <li>Impresiones o productos</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Por favor, contacta a través del{' '}
                <Link
                  href="/#contact"
                  className="text-accent hover:underline font-medium"
                >
                  formulario de licencias
                </Link>{' '}
                para solicitar permisos y presupuestos personalizados.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Metadata Information */}
        <motion.div
          className="border border-border p-6 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-3 font-serif">
            Metadatos de Copyright
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Todas las imágenes contienen los siguientes metadatos embebidos:
          </p>
          <div className="bg-muted/30 p-4 rounded-md font-mono text-sm">
            <div>Artist: Alex Vicente</div>
            <div>Copyright: © Alex Vicente</div>
            <div>Rights: All Rights Reserved</div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 pt-8 border-t border-border text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Alex Vicente López. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Última actualización:{' '}
            {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>
      </div>
    </main>
  )
}
