"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, Send, Instagram, Camera, FileImage, Copyright, CheckCircle, AlertCircle } from "lucide-react"

export function Contact() {
  const [formType, setFormType] = useState<"general" | "license">("general")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [licenseData, setLicenseData] = useState({
    name: "",
    email: "",
    company: "",
    photoId: "",
    usageType: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "d72eeacd-28fc-442b-83bd-b8c383c5997e",
          subject: "Nuevo mensaje de contacto - Galería Fotográfica",
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({ type: "success", message: "¡Mensaje enviado correctamente! Te responderé pronto." })
        setFormData({ name: "", email: "", message: "" })
      } else {
        throw new Error("Error al enviar")
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Error al enviar el mensaje. Intenta de nuevo o contáctame directamente por email." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const message = `
📸 SOLICITUD DE LICENCIA FOTOGRÁFICA

Nombre: ${licenseData.name}
Email: ${licenseData.email}
Empresa: ${licenseData.company || "No especificada"}

Fotografía de interés: ${licenseData.photoId}
Tipo de uso: ${licenseData.usageType}

Descripción del proyecto:
${licenseData.description}
      `

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "d72eeacd-28fc-442b-83bd-b8c383c5997e",
          subject: `🔒 Solicitud de Licencia - ${licenseData.photoId}`,
          from_name: licenseData.name,
          email: licenseData.email,
          message: message,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({ type: "success", message: "¡Solicitud de licencia enviada! Te contactaré pronto con información detallada." })
        setLicenseData({ name: "", email: "", company: "", photoId: "", usageType: "", description: "" })
      } else {
        throw new Error("Error al enviar")
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Error al enviar la solicitud. Contáctame directamente en alexviclop@gmail.com" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">Contáctame</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed px-2">
            ¿Quieres hablar sobre un proyecto o solicitar una licencia? Estoy disponible en las siguientes plataformas
          </p>

          {/* Status Message */}
          {submitStatus && (
            <div className={submitStatus.type === "success" 
              ? "p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto bg-green-500/10 border border-green-500/20"
              : "p-4 rounded-lg flex items-center gap-3 max-w-2xl mx-auto bg-red-500/10 border border-red-500/20"
            }>
              {submitStatus.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <p className={submitStatus.type === "success" ? "text-green-500" : "text-red-500"}>
                {submitStatus.message}
              </p>
            </div>
          )}
          
          {/* Form Type Selector */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant={formType === "general" ? "default" : "outline"}
              onClick={() => setFormType("general")}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contacto General
            </Button>
            <Button
              variant={formType === "license" ? "default" : "outline"}
              onClick={() => setFormType("license")}
              className="flex items-center gap-2"
            >
              <Copyright className="h-4 w-4" />
              Solicitar Licencia
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-6">
            {formType === "general" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  placeholder="Cuéntame sobre tu proyecto..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
            ) : (
            <form onSubmit={handleLicenseSubmit} className="space-y-4">
              <div className="bg-accent/10 p-4 rounded-lg mb-4 border border-accent/20">
                <div className="flex items-start gap-3">
                  <FileImage className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Solicitud de Licencia Fotográfica</h4>
                    <p className="text-xs text-muted-foreground">
                      Completa este formulario para solicitar permiso de uso de fotografías
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="license-name" className="block text-sm font-medium mb-2">
                  Nombre Completo *
                </label>
                <Input
                  id="license-name"
                  type="text"
                  placeholder="Tu nombre"
                  value={licenseData.name}
                  onChange={(e) => setLicenseData({ ...licenseData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="license-email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <Input
                  id="license-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={licenseData.email}
                  onChange={(e) => setLicenseData({ ...licenseData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Empresa/Organización
                </label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Nombre de tu empresa (opcional)"
                  value={licenseData.company}
                  onChange={(e) => setLicenseData({ ...licenseData, company: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="photoId" className="block text-sm font-medium mb-2">
                  Fotografía de Interés *
                </label>
                <Input
                  id="photoId"
                  type="text"
                  placeholder="Título o número de la foto"
                  value={licenseData.photoId}
                  onChange={(e) => setLicenseData({ ...licenseData, photoId: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="usageType" className="block text-sm font-medium mb-2">
                  Tipo de Uso *
                </label>
                <select
                  id="usageType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={licenseData.usageType}
                  onChange={(e) => setLicenseData({ ...licenseData, usageType: e.target.value })}
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="comercial">Uso Comercial</option>
                  <option value="editorial">Publicación Editorial</option>
                  <option value="web">Web/Redes Sociales</option>
                  <option value="publicitario">Material Publicitario</option>
                  <option value="impresion">Impresión/Productos</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Descripción del Proyecto *
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe cómo planeas usar la fotografía, duración, alcance, etc."
                  rows={4}
                  value={licenseData.description}
                  onChange={(e) => setLicenseData({ ...licenseData, description: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <FileImage className="h-4 w-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar Solicitud de Licencia"}
              </Button>
            </form>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Redes Sociales</h3>
              <div className="space-y-4">
                <a
                  href="mailto:alexviclop@gmail.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Mail className="h-5 w-5 group-hover:text-primary transition-colors" />
                  </div>
                  <span>alexviclop@gmail.com</span>
                </a>
                <a
                  href="https://github.com/AVL05"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Github className="h-5 w-5 group-hover:text-primary transition-colors" />
                  </div>
                  <span>github.com/AVL05</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/alex-vicente-lopez-083821309/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Linkedin className="h-5 w-5 group-hover:text-primary transition-colors" />
                  </div>
                  <span>linkedin.com/in/alexvicente</span>
                </a>
                <a
                  href="https://www.instagram.com/aleexx_005/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Instagram className="h-5 w-5 group-hover:text-primary transition-colors" />
                  </div>
                  <span>@aleexx_005</span>
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-start gap-3">
                <Camera className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Portfolio</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed mb-4">
                    Explora mi portfolio
                  </p>
                  <Button variant="outline" asChild>
                    <a href="https://aleviclop.vercel.app/">Ver</a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Alex Vicente López. Diseñado y desarrollado con pasión</p>
        </footer>
      </div>
    </section>
  )
}
