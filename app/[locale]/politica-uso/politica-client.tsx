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
import { SmoothScroll } from '@/components/smooth-scroll'

export function PoliticaClient({ locale }: { locale: string }) {
  return (
    <SmoothScroll>
    <main className="min-h-screen py-20 px-6 lg:px-12 relative z-10">
      <div className="container mx-auto max-w-4xl relative z-10 bg-background/95 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
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
              {locale === 'es' ? 'Política de Uso' : 'Usage Policy'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {locale === 'es' 
              ? 'Términos y condiciones de uso de las fotografías de Alex Vicente' 
              : 'Terms and conditions for the use of Alex Vicente\'s photographs'}
          </p>
        </motion.div>

        {/* Copyright Notice */}
        <motion.div
          className="bg-white/5 p-8 rounded-xl mb-12 border border-white/10"
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
                {locale === 'es'
                  ? 'Todas las fotografías mostradas en esta galería son propiedad intelectual de Alex Vicente y están protegidas por las leyes de copyright internacionales. Cada imagen contiene metadatos de copyright embebidos con la información del autor.'
                  : 'All photographs shown in this gallery are the intellectual property of Alex Vicente and are protected by international copyright laws. Each image contains embedded copyright metadata with author information.'}
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
                {locale === 'es' ? 'Uso No Autorizado' : 'Unauthorized Use'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'es' ? 'Queda estrictamente prohibido:' : 'Strictly prohibited:'}
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-muted-foreground">
                <li>{locale === 'es' ? 'Descargar, copiar o reproducir las imágenes sin autorización expresa' : 'Downloading, copying, or reproducing images without express authorization'}</li>
                <li>{locale === 'es' ? 'Uso comercial sin licencia' : 'Commercial use without a license'}</li>
                <li>{locale === 'es' ? 'Modificación, edición o manipulación de las fotografías' : 'Modification, editing, or manipulation of the photographs'}</li>
                <li>{locale === 'es' ? 'Redistribución o publicación en otros medios' : 'Redistribution or publication in other media'}</li>
                <li>{locale === 'es' ? 'Eliminación o alteración de los metadatos de copyright' : 'Removal or alteration of copyright metadata'}</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Licensing */}
        <motion.div
          className="bg-accent/5 p-8 rounded-xl mb-12 border border-accent/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <Share2 className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4 font-serif">
                {locale === 'es' ? 'Licencias Disponibles' : 'Available Licenses'}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {locale === 'es' 
                  ? 'Si estás interesado en utilizar alguna fotografía para proyectos comerciales, editoriales o publicidad:'
                  : 'If you are interested in using any photograph for commercial, editorial, or advertising projects:'}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {locale === 'es' ? 'Por favor, contacta a través del' : 'Please contact through the'}{' '}
                <Link
                  href={`/${locale}#contact`}
                  className="text-accent hover:underline font-medium"
                >
                  {locale === 'es' ? 'formulario de licencias' : 'licensing form'}
                </Link>{' '}
                {locale === 'es' ? 'para solicitar permisos.' : 'to request permissions.'}
              </p>
            </div>
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
            © {new Date().getFullYear()} Alex Vicente López.
          </p>
        </motion.div>
      </div>
    </main>
    </SmoothScroll>
  )
}
