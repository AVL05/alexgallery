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
  Instagram,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
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
    <section id="contact" className="py-16 md:py-24 lg:py-32 px-6 sm:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">{dictionary.title}</h2>
          <p className="text-muted-foreground">{dictionary.description}</p>
          
          {submitStatus && (
            <div 
               ref={statusRef}
               className={`mt-6 p-4 rounded-lg flex items-center gap-3 justify-center ${submitStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
            >
              {submitStatus.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {submitStatus.message}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <Button variant={formType === 'general' ? 'default' : 'outline'} onClick={() => setFormType('general')}>
                {dictionary.form.send}
            </Button>
            <Button variant={formType === 'license' ? 'default' : 'outline'} onClick={() => setFormType('license')}>
                Licencias
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <Card className="p-6">
             {formType === 'general' ? (
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                    <div>
                        <Input {...contactForm.register('name')} placeholder={dictionary.form.name} className={contactForm.formState.errors.name ? 'border-red-500' : ''} />
                        {contactForm.formState.errors.name && <p className="text-[10px] text-red-500 mt-1">{contactForm.formState.errors.name.message}</p>}
                    </div>
                    <div>
                        <Input {...contactForm.register('email')} placeholder={dictionary.form.email} className={contactForm.formState.errors.email ? 'border-red-500' : ''} />
                        {contactForm.formState.errors.email && <p className="text-[10px] text-red-500 mt-1">{contactForm.formState.errors.email.message}</p>}
                    </div>
                    <div>
                        <Textarea {...contactForm.register('message')} placeholder={dictionary.form.message} rows={5} className={contactForm.formState.errors.message ? 'border-red-500' : ''} />
                        {contactForm.formState.errors.message && <p className="text-[10px] text-red-500 mt-1">{contactForm.formState.errors.message.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? dictionary.form.sending : dictionary.form.send}
                    </Button>
                </form>
             ) : (
                <form onSubmit={licenseForm.handleSubmit(onLicenseSubmit)} className="space-y-4">
                    <Input {...licenseForm.register('name')} placeholder="Nombre completo" />
                    <Input {...licenseForm.register('email')} placeholder="Email" />
                    <Input {...licenseForm.register('photoId')} placeholder="ID de la foto / Título" />
                    <select {...licenseForm.register('usageType')} className="w-full bg-background border rounded-md p-2 text-sm">
                        <option value="">Tipo de uso</option>
                        <option value="comercial">Comercial</option>
                        <option value="editorial">Editorial</option>
                        <option value="personal">Personal</option>
                    </select>
                    <Textarea {...licenseForm.register('description')} placeholder="Uso previsto..." rows={3} />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        Solicitar Licencia
                    </Button>
                </form>
             )}
           </Card>

           <div className="space-y-4">
              <Card className="p-6">
                 <h3 className="font-bold mb-4">Redes sociales</h3>
                 <div className="space-y-3">
                    <a href="mailto:alexviclop@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                        <Mail className="h-4 w-4" /> alexviclop@gmail.com
                    </a>
                    <a href="https://instagram.com/aleexx_005/" className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                        <Instagram className="h-4 w-4" /> @aleexx_005
                    </a>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </section>
  )
}
