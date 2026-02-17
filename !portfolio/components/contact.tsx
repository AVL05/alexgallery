"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Github, Instagram, Linkedin, Mail, Send } from "lucide-react";
import type React from "react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "d72eeacd-28fc-442b-83bd-b8c383c5997e",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance">
            Contáctame
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed px-2">
            ¿Quieres hablar sobre un proyecto? Estoy disponible en las
            siguientes plataformas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Nombre
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  placeholder="Cuéntame sobre tu proyecto..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>

              {submitStatus === "success" && (
                <p className="text-sm text-green-600 dark:text-green-400 text-center">
                  ¡Mensaje enviado con éxito! Te responderé pronto.
                </p>
              )}

              {submitStatus === "error" && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  Hubo un error al enviar el mensaje. Por favor, intenta de
                  nuevo.
                </p>
              )}
            </form>
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

            <Card className="p-6 bg-linear-to-br from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-start gap-3">
                <Camera className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Portfolio Fotográfico
                  </h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed mb-4">
                    Explora mi colección completa de fotografías profesionales
                  </p>
                  <Button variant="outline" asChild>
                    <a href="#photography">Ver Galería</a>
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
  );
}
