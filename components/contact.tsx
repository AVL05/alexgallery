'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Mail,
  Camera,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP)
}

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es muy corto'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

const licenseSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  photoId: z.string().min(1, 'ID de foto requerido'),
  usageType: z.string().min(1, 'Selecciona un tipo de uso'),
  description: z.string().min(10, 'Describe el uso previsto'),
})

type ContactFormValues = z.infer<typeof contactSchema>
type LicenseFormValues = z.infer<typeof licenseSchema>

export function Contact({ dictionary }: { dictionary: any }) {
  const [formType, setFormType] = useState<'general' | 'license'>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const statusRef = useRef<HTMLDivElement>(null)

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })

  const licenseForm = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseSchema),
    defaultValues: { name: '', email: '', company: '', photoId: '', usageType: '', description: '' },
  })

  useGSAP(() => {
    if (submitStatus && statusRef.current) {
      gsap.fromTo(statusRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    }

    // New entrance animation for the section
    gsap.from('.contact-reveal', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom-=100px',
        toggleActions: 'play none none none'
      }
    })
  }, [submitStatus])

  const onContactSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'd72eeacd-28fc-442b-83bd-b8c383c5997e',
          ...data,
          subject: 'Nuevo mensaje - Galería',
        }),
      })
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: dictionary.form.success })
        contactForm.reset()
      } else {
        throw new Error()
      }
    } catch {
      setSubmitStatus({ type: 'error', message: dictionary.form.error })
    } finally {
        setIsSubmitting(false)
    }
  }

  const onLicenseSubmit = async (data: LicenseFormValues) => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: 'd72eeacd-28fc-442b-83bd-b8c383c5997e',
            ...data,
            subject: `Licencia: ${data.photoId}`,
            message: `Empresa: ${data.company}\nUso: ${data.usageType}\nDesc: ${data.description}`
          }),
        })
        if (response.ok) {
          setSubmitStatus({ type: 'success', message: 'Solicitud enviada' })
          licenseForm.reset()
        } else {
          throw new Error()
        }
      } catch {
        setSubmitStatus({ type: 'error', message: 'Error al enviar' })
      } finally {
          setIsSubmitting(false)
      }
  }

  return (
    <section id="contact" className="py-24 md:py-32 lg:py-40 px-6 sm:px-8 bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 contact-reveal">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">{dictionary.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{dictionary.description}</p>

          <div className="flex justify-center gap-6 mt-12">
            <button
                onClick={() => setFormType('general')}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${formType === 'general' ? 'bg-accent text-black scale-105' : 'bg-white/5 text-white/40 hover:text-white'}`}
            >
                {dictionary.form.send}
            </button>
            <button
                onClick={() => setFormType('license')}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${formType === 'license' ? 'bg-accent text-black scale-105' : 'bg-white/5 text-white/40 hover:text-white'}`}
            >
                Licencias
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 contact-reveal">
             <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                 {formType === 'general' ? (
                    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <input {...contactForm.register('name')} placeholder={dictionary.form.name} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                            <input {...contactForm.register('email')} placeholder={dictionary.form.email} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                        </div>
                        <textarea {...contactForm.register('message')} placeholder={dictionary.form.message} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                        <button type="submit" className="w-full py-5 bg-accent text-black font-black uppercase tracking-[0.3em] rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-4" disabled={isSubmitting}>
                            {isSubmitting ? dictionary.form.sending : dictionary.form.send}
                        </button>
                    </form>
                 ) : (
                    <form onSubmit={licenseForm.handleSubmit(onLicenseSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <input {...licenseForm.register('name')} placeholder="Nombre completo" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                            <input {...licenseForm.register('email')} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                        </div>
                        <input {...licenseForm.register('photoId')} placeholder="ID de la foto / Título" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                        <select {...licenseForm.register('usageType')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors appearance-none text-white/40">
                            <option value="">Tipo de uso</option>
                            <option value="comercial">Comercial</option>
                            <option value="editorial">Editorial</option>
                            <option value="personal">Personal</option>
                        </select>
                        <textarea {...licenseForm.register('description')} placeholder="Uso previsto..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors" />
                        <button type="submit" className="w-full py-5 bg-accent text-black font-black uppercase tracking-[0.3em] rounded-xl hover:brightness-110 transition-all" disabled={isSubmitting}>
                            Solicitar Licencia
                        </button>
                    </form>
                 )}
             </div>
           </div>

           <div className="space-y-8 contact-reveal">
              <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                 <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Social Connect</h3>
                 <div className="space-y-6">
                    <a href="mailto:alexviclop@gmail.com" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                            <Mail className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-mono text-white/40 group-hover:text-white transition-colors">alexviclop@gmail.com</span>
                    </a>
                    <a href="https://instagram.com/aleexx_005/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                            <InstagramIcon />
                        </div>
                        <span className="text-sm font-mono text-white/40 group-hover:text-white transition-colors">@aleexx_005</span>
                    </a>
                 </div>
              </div>

              <div className="p-8 border border-white/5 rounded-3xl flex items-center justify-center h-40">
                 <span className="text-[10rem] font-black opacity-[0.03] select-none">AV</span>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}
