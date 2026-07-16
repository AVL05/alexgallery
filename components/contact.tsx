"use client";

import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/layout";
import type { ContactDictionary } from "@/types/dictionary";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, ChevronDown, Mail } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  botcheck?: string;
};

type LicenseFormValues = {
  name: string;
  email: string;
  company?: string;
  photoId: string;
  usageType: string;
  description: string;
  botcheck?: string;
};

const labelClass = "rv-label mb-2 block text-[var(--color-text-secondary)]";
const errorClass = "mt-2 text-xs leading-relaxed text-[var(--color-error)]";

export function Contact({ dictionary }: { dictionary: ContactDictionary }) {
  const [formType, setFormType] = useState<"general" | "license">("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, dictionary.form.validation.name).max(80),
        email: z.string().trim().email(dictionary.form.validation.email).max(120),
        message: z
          .string()
          .trim()
          .min(10, dictionary.form.validation.message)
          .max(2000),
        botcheck: z.string().optional(),
      }),
    [dictionary],
  );

  const licenseSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, dictionary.form.validation.name).max(80),
        email: z.string().trim().email(dictionary.form.validation.email).max(120),
        company: z.string().trim().max(120).optional(),
        photoId: z
          .string()
          .trim()
          .min(1, dictionary.form.validation.photo_id)
          .max(120),
        usageType: z
          .string()
          .trim()
          .min(1, dictionary.form.validation.usage_type)
          .max(40),
        description: z
          .string()
          .trim()
          .min(10, dictionary.form.validation.usage_description)
          .max(2000),
        botcheck: z.string().optional(),
      }),
    [dictionary],
  );

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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (submitStatus && statusRef.current) {
      gsap.fromTo(
        statusRef.current,
        { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : -8 },
        { opacity: 1, y: 0, duration: reduceMotion ? 0 : 0.3, ease: "power2.out" },
      );
    }
    if (reduceMotion) {
      gsap.set(".contact-reveal", { opacity: 1, y: 0 });
      return;
    }
    gsap.from(".contact-reveal", {
      y: 36,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#contact",
        start: "top bottom-=100px",
        toggleActions: "play none none none",
      },
    });
  }, [submitStatus]);

  const submit = async (
    data: ContactFormValues | LicenseFormValues,
    kind: "general" | "license",
  ) => {
    if (data.botcheck) return;
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "d72eeacd-28fc-442b-83bd-b8c383c5997e",
          ...data,
          subject:
            kind === "general"
              ? "Nuevo contacto - raw.vives"
              : `Solicitud de licencia - raw.vives: ${(data as LicenseFormValues).photoId}`,
        }),
      });
      if (!response.ok) throw new Error();
      setSubmitStatus({
        type: "success",
        message:
          kind === "general"
            ? dictionary.form.success
            : dictionary.form.license_success,
      });
      kind === "general" ? contactForm.reset() : licenseForm.reset();
    } catch {
      setSubmitStatus({ type: "error", message: dictionary.form.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = submitStatus && (
    <div
      ref={statusRef}
      role="status"
      aria-live="polite"
      className={`border px-4 py-3 text-sm ${
        submitStatus.type === "success"
          ? "border-[var(--color-success)] text-[var(--color-success)]"
          : "border-[var(--color-error)] text-[var(--color-error)]"
      }`}
    >
      {submitStatus.message}
    </div>
  );

  return (
    <Section id="contact" className="overflow-hidden bg-background">
      <Container>
        <div className="contact-reveal mb-12 max-w-3xl md:mb-16">
          <p className="rv-kicker mb-5">raw.vives / Contact</p>
          <h2 className="rv-section-title mb-6">{dictionary.title}</h2>
          <p className="rv-intro">{dictionary.description}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="contact-reveal lg:col-span-8">
            <fieldset className="mb-8 flex flex-wrap gap-2 border-0 p-0">
              <legend className="sr-only">{dictionary.title}</legend>
              <Button
                type="button"
                variant={formType === "general" ? "default" : "outline"}
                aria-pressed={formType === "general"}
                onClick={() => {
                  setFormType("general");
                  setSubmitStatus(null);
                }}
              >
                {dictionary.general}
              </Button>
              <Button
                type="button"
                variant={formType === "license" ? "default" : "outline"}
                aria-pressed={formType === "license"}
                onClick={() => {
                  setFormType("license");
                  setSubmitStatus(null);
                }}
              >
                {dictionary.license}
              </Button>
            </fieldset>

            {formType === "general" ? (
              <form
                onSubmit={contactForm.handleSubmit((data) => submit(data, "general"))}
                className="space-y-6"
                noValidate
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  {...contactForm.register("botcheck")}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="contact-name">
                      {dictionary.form.name}
                    </label>
                    <input
                      id="contact-name"
                      autoComplete="name"
                      {...contactForm.register("name")}
                      aria-invalid={!!contactForm.formState.errors.name}
                      aria-describedby={contactForm.formState.errors.name ? "contact-name-error" : undefined}
                      className="rv-field"
                    />
                    {contactForm.formState.errors.name && (
                      <p id="contact-name-error" className={errorClass} role="alert">
                        {contactForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="contact-email">
                      {dictionary.form.email}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      {...contactForm.register("email")}
                      aria-invalid={!!contactForm.formState.errors.email}
                      aria-describedby={contactForm.formState.errors.email ? "contact-email-error" : undefined}
                      className="rv-field"
                    />
                    {contactForm.formState.errors.email && (
                      <p id="contact-email-error" className={errorClass} role="alert">
                        {contactForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="contact-message">
                    {dictionary.form.message}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    {...contactForm.register("message")}
                    aria-invalid={!!contactForm.formState.errors.message}
                    aria-describedby={contactForm.formState.errors.message ? "contact-message-error" : undefined}
                    className="rv-field resize-y"
                  />
                  {contactForm.formState.errors.message && (
                    <p id="contact-message-error" className={errorClass} role="alert">
                      {contactForm.formState.errors.message.message}
                    </p>
                  )}
                </div>
                {status}
                <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? dictionary.form.sending : dictionary.form.send}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={licenseForm.handleSubmit((data) => submit(data, "license"))}
                className="space-y-6"
                noValidate
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  {...licenseForm.register("botcheck")}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="license-name">{dictionary.form.name}</label>
                    <input id="license-name" autoComplete="name" {...licenseForm.register("name")} aria-invalid={!!licenseForm.formState.errors.name} className="rv-field" />
                    {licenseForm.formState.errors.name && <p className={errorClass} role="alert">{licenseForm.formState.errors.name.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="license-email">{dictionary.form.email}</label>
                    <input id="license-email" type="email" autoComplete="email" {...licenseForm.register("email")} aria-invalid={!!licenseForm.formState.errors.email} className="rv-field" />
                    {licenseForm.formState.errors.email && <p className={errorClass} role="alert">{licenseForm.formState.errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-company">{dictionary.form.company}</label>
                  <input id="license-company" autoComplete="organization" {...licenseForm.register("company")} className="rv-field" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-photo">{dictionary.form.photo_id}</label>
                  <input id="license-photo" {...licenseForm.register("photoId")} aria-invalid={!!licenseForm.formState.errors.photoId} className="rv-field" />
                  {licenseForm.formState.errors.photoId && <p className={errorClass} role="alert">{licenseForm.formState.errors.photoId.message}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-usage">{dictionary.form.usage_type}</label>
                  <div className="relative">
                    <select id="license-usage" {...licenseForm.register("usageType")} aria-invalid={!!licenseForm.formState.errors.usageType} className="rv-field appearance-none pr-10">
                      <option value="">{dictionary.form.usage_type}</option>
                      <option value="commercial">{dictionary.form.usage_commercial}</option>
                      <option value="editorial">{dictionary.form.usage_editorial}</option>
                      <option value="personal">{dictionary.form.usage_personal}</option>
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  </div>
                  {licenseForm.formState.errors.usageType && <p className={errorClass} role="alert">{licenseForm.formState.errors.usageType.message}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-description">{dictionary.form.usage_description}</label>
                  <textarea id="license-description" rows={5} {...licenseForm.register("description")} aria-invalid={!!licenseForm.formState.errors.description} className="rv-field resize-y" />
                  {licenseForm.formState.errors.description && <p className={errorClass} role="alert">{licenseForm.formState.errors.description.message}</p>}
                </div>
                {status}
                <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? dictionary.form.sending : dictionary.form.request}
                </Button>
              </form>
            )}
          </div>

          <aside className="contact-reveal border-t border-border pt-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="rv-kicker mb-6">{dictionary.social}</p>
            <div className="space-y-2">
              <a href="mailto:alexviclop@gmail.com" className="group flex min-h-14 items-center justify-between gap-4 border-b border-border py-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-foreground">
                <span className="flex min-w-0 items-center gap-3"><Mail aria-hidden="true" className="size-4 shrink-0" /><span className="break-all">alexviclop@gmail.com</span></span>
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href="https://instagram.com/aleexx_005/" target="_blank" rel="noreferrer" className="group flex min-h-14 items-center justify-between gap-4 border-b border-border py-3 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-foreground">
                <span className="flex items-center gap-3"><span aria-hidden="true" className="font-mono text-[10px]">IG</span>@aleexx_005</span>
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <p className="rv-body-sm mt-8 text-[var(--color-text-muted)]">
              {dictionary.location}<br />{dictionary.independent}
            </p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
