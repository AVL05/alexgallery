"use client";

import type { ContactDictionary } from "@/types/dictionary";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronDown, Mail } from "lucide-react";

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
);
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(80),
  email: z.string().trim().email("Email inválido").max(120),
  message: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000),
  botcheck: z.string().optional(),
});

const licenseSchema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(80),
  email: z.string().trim().email("Email inválido").max(120),
  company: z.string().trim().max(120).optional(),
  photoId: z.string().trim().min(1, "ID de foto requerido").max(120),
  usageType: z.string().trim().min(1, "Selecciona un tipo de uso").max(40),
  description: z
    .string()
    .trim()
    .min(10, "Describe el uso previsto")
    .max(2000),
  botcheck: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type LicenseFormValues = z.infer<typeof licenseSchema>;

const fieldClass =
  "w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-accent outline-none transition-colors";
const errorClass = "mt-1.5 text-[10px] font-mono text-white/50";

export function Contact({ dictionary }: { dictionary: ContactDictionary }) {
  const [formType, setFormType] = useState<"general" | "license">("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const statusRef = useRef<HTMLDivElement>(null);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", botcheck: "" },
  });

  const licenseForm = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      photoId: "",
      usageType: "",
      description: "",
      botcheck: "",
    },
  });

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (submitStatus && statusRef.current) {
      if (prefersReducedMotion) {
        gsap.set(statusRef.current, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          statusRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      }
    }

    if (prefersReducedMotion) {
      gsap.set(".contact-reveal", { opacity: 1, y: 0 });
      return;
    }

    gsap.from(".contact-reveal", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top bottom-=100px",
        toggleActions: "play none none none",
      },
    });
  }, [submitStatus]);

  const onContactSubmit = async (data: ContactFormValues) => {
    if (data.botcheck) {
      contactForm.reset();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "d72eeacd-28fc-442b-83bd-b8c383c5997e",
          ...data,
          subject: "Nuevo contacto - alexgallery",
        }),
      });
      if (response.ok) {
        setSubmitStatus({ type: "success", message: dictionary.form.success });
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus({ type: "error", message: dictionary.form.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLicenseSubmit = async (data: LicenseFormValues) => {
    if (data.botcheck) {
      licenseForm.reset();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "d72eeacd-28fc-442b-83bd-b8c383c5997e",
          ...data,
          subject: `Solicitud de licencia - alexgallery: ${data.photoId}`,
          message: `Empresa: ${data.company}\nUso: ${data.usageType}\nDesc: ${data.description}`,
        }),
      });
      if (response.ok) {
        setSubmitStatus({ type: "success", message: "Solicitud enviada" });
        licenseForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus({ type: "error", message: "Error al enviar" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 lg:py-40 px-6 sm:px-8 bg-black relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 contact-reveal">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            {dictionary.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {dictionary.description}
          </p>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="button"
              onClick={() => setFormType("general")}
              aria-pressed={formType === "general"}
              className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${formType === "general" ? "bg-accent text-black scale-105" : "bg-white/5 text-white/40 hover:text-white"}`}
            >
              {dictionary.general}
            </button>
            <button
              type="button"
              onClick={() => setFormType("license")}
              aria-pressed={formType === "license"}
              className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${formType === "license" ? "bg-accent text-black scale-105" : "bg-white/5 text-white/40 hover:text-white"}`}
            >
              {dictionary.license}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 contact-reveal">
            <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              {formType === "general" ? (
                <form
                  onSubmit={contactForm.handleSubmit(onContactSubmit)}
                  className="space-y-6"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    {...contactForm.register("botcheck")}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <input
                        {...contactForm.register("name")}
                        placeholder={dictionary.form.name}
                        aria-label={dictionary.form.name}
                        aria-invalid={!!contactForm.formState.errors.name}
                        className={fieldClass}
                      />
                      {contactForm.formState.errors.name && (
                        <p className={errorClass} role="alert">
                          {contactForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        {...contactForm.register("email")}
                        type="email"
                        placeholder={dictionary.form.email}
                        aria-label={dictionary.form.email}
                        aria-invalid={!!contactForm.formState.errors.email}
                        className={fieldClass}
                      />
                      {contactForm.formState.errors.email && (
                        <p className={errorClass} role="alert">
                          {contactForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <textarea
                      {...contactForm.register("message")}
                      placeholder={dictionary.form.message}
                      aria-label={dictionary.form.message}
                      aria-invalid={!!contactForm.formState.errors.message}
                      rows={6}
                      className={fieldClass}
                    />
                    {contactForm.formState.errors.message && (
                      <p className={errorClass} role="alert">
                        {contactForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>
                  {submitStatus && (
                    <div
                      ref={statusRef}
                      role="status"
                      aria-live="polite"
                      className={`border px-4 py-3 text-sm ${
                        submitStatus.type === "success"
                          ? "border-white/20 text-white"
                          : "border-white/30 text-white/80"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-5 bg-accent text-black font-black uppercase tracking-[0.3em] rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? dictionary.form.sending
                      : dictionary.form.send}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={licenseForm.handleSubmit(onLicenseSubmit)}
                  className="space-y-6"
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    {...licenseForm.register("botcheck")}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <input
                        {...licenseForm.register("name")}
                        placeholder="Nombre completo"
                        aria-label="Nombre completo"
                        aria-invalid={!!licenseForm.formState.errors.name}
                        className={fieldClass}
                      />
                      {licenseForm.formState.errors.name && (
                        <p className={errorClass} role="alert">
                          {licenseForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        {...licenseForm.register("email")}
                        type="email"
                        placeholder="Email"
                        aria-label="Email"
                        aria-invalid={!!licenseForm.formState.errors.email}
                        className={fieldClass}
                      />
                      {licenseForm.formState.errors.email && (
                        <p className={errorClass} role="alert">
                          {licenseForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <input
                      {...licenseForm.register("photoId")}
                      placeholder="ID de la foto / Título"
                      aria-label="ID de la foto o título"
                      aria-invalid={!!licenseForm.formState.errors.photoId}
                      className={fieldClass}
                    />
                    {licenseForm.formState.errors.photoId && (
                      <p className={errorClass} role="alert">
                        {licenseForm.formState.errors.photoId.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <select
                        {...licenseForm.register("usageType")}
                        aria-label="Tipo de uso"
                        aria-invalid={!!licenseForm.formState.errors.usageType}
                        className={`${fieldClass} appearance-none pr-10 text-white/60`}
                      >
                        <option value="">Tipo de uso</option>
                        <option value="comercial">Comercial</option>
                        <option value="editorial">Editorial</option>
                        <option value="personal">Personal</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    </div>
                    {licenseForm.formState.errors.usageType && (
                      <p className={errorClass} role="alert">
                        {licenseForm.formState.errors.usageType.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <textarea
                      {...licenseForm.register("description")}
                      placeholder="Uso previsto..."
                      aria-label="Uso previsto"
                      aria-invalid={!!licenseForm.formState.errors.description}
                      rows={4}
                      className={fieldClass}
                    />
                    {licenseForm.formState.errors.description && (
                      <p className={errorClass} role="alert">
                        {licenseForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  {submitStatus && (
                    <div
                      ref={statusRef}
                      role="status"
                      aria-live="polite"
                      className={`border px-4 py-3 text-sm ${
                        submitStatus.type === "success"
                          ? "border-white/20 text-white"
                          : "border-white/30 text-white/80"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-5 bg-accent text-black font-black uppercase tracking-[0.3em] rounded-xl hover:brightness-110 transition-all"
                    disabled={isSubmitting}
                  >
                    Solicitar Licencia
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-8 contact-reveal">
            <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-8">
                {dictionary.social}
              </h3>
              <div className="space-y-6">
                <a
                  href="mailto:alexviclop@gmail.com"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-mono text-white/40 group-hover:text-white transition-colors">
                    alexviclop@gmail.com
                  </span>
                </a>
                <a
                  href="https://instagram.com/aleexx_005/"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                    <InstagramIcon />
                  </div>
                  <span className="text-sm font-mono text-white/40 group-hover:text-white transition-colors">
                    @aleexx_005
                  </span>
                </a>
              </div>
            </div>

            <div className="p-8 border border-white/5 rounded-3xl space-y-4">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                © {new Date().getFullYear()} Alex Vicente López
              </p>
              <p className="text-[11px] text-white/20 leading-relaxed font-light">
                Todas las imágenes están protegidas por derechos de autor. Contacta para solicitar una licencia de uso comercial o editorial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
