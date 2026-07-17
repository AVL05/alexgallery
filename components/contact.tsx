"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { useMotion } from "@/components/motion/motion-provider";
import { motionDistance, motionDuration, motionEase, motionStagger } from "@/lib/motion/config";
import {
  type ContactFieldErrors,
  type ContactFormValues,
  type LicenseFormValues,
  validateContactForm,
  validateLicenseForm,
} from "@/lib/contact/validation";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import type { ContactDictionary } from "@/types/dictionary";
import type { Locale } from "@/types/dictionary";
import { ArrowUpRight, ChevronDown, Mail } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { web3FormsAccessKey } from "@/lib/site-config";

const labelClass = "rv-label mb-2 block text-[var(--color-text-secondary)]";
const errorClass = "mt-2 text-xs leading-relaxed text-[var(--color-error)]";

export function Contact({ dictionary, locale }: { dictionary: ContactDictionary; locale: Locale }) {
  const [formType, setFormType] = useState<"general" | "license">("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [formErrors, setFormErrors] = useState<ContactFieldErrors>({});
  const statusRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isTouchDevice } = useMotion();

  useGSAP(() => {
    if (submitStatus && statusRef.current) {
      gsap.fromTo(
        statusRef.current,
        { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -8 },
        { opacity: 1, y: 0, duration: prefersReducedMotion ? 0 : motionDuration.fast, ease: motionEase.standard },
      );
    }
  }, { dependencies: [prefersReducedMotion, submitStatus], scope: statusRef, revertOnUpdate: true });

  useGSAP(() => {
    if (prefersReducedMotion) {
      gsap.set(".contact-reveal", { opacity: 1, y: 0 });
      return;
    }
    gsap.from(".contact-reveal", {
      y: isTouchDevice ? 12 : motionDistance.section,
      opacity: 0,
      duration: isTouchDevice ? motionDuration.normal : motionDuration.slow,
      stagger: isTouchDevice ? motionStagger.tight : motionStagger.normal,
      ease: motionEase.enter,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom-=100px",
        toggleActions: "play none none none",
      },
    });
  }, { dependencies: [isTouchDevice, prefersReducedMotion], scope: containerRef, revertOnUpdate: true });

  const submit = async (
    event: FormEvent<HTMLFormElement>,
    kind: "general" | "license",
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const entries = new FormData(form);
    const value = (name: string) => String(entries.get(name) ?? "").trim();
    const data: ContactFormValues | LicenseFormValues = kind === "general"
      ? {
          name: value("name"),
          email: value("email"),
          message: value("message"),
          botcheck: value("botcheck"),
        }
      : {
          name: value("name"),
          email: value("email"),
          company: value("company"),
          photoId: value("photoId"),
          usageType: value("usageType"),
          description: value("description"),
          botcheck: value("botcheck"),
        };
    const errors = kind === "general"
      ? validateContactForm(data as ContactFormValues, dictionary.form.validation)
      : validateLicenseForm(data as LicenseFormValues, dictionary.form.validation);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (data.botcheck) return;
    if (!web3FormsAccessKey) {
      setSubmitStatus({ type: "error", message: dictionary.form.error });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
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
      form.reset();
    } catch {
      setSubmitStatus({ type: "error", message: dictionary.form.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFieldError = (field: keyof ContactFieldErrors) => {
    if (!formErrors[field]) return;
    setFormErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
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
    <section ref={containerRef} id="contact" className="rv-section overflow-hidden bg-background">
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
                  setFormErrors({});
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
                  setFormErrors({});
                }}
              >
                {dictionary.license}
              </Button>
            </fieldset>

            {formType === "general" ? (
              <form
                onSubmit={(event) => submit(event, "general")}
                action="https://api.web3forms.com/submit"
                method="POST"
                className="space-y-6"
              >
                <input type="hidden" name="access_key" value={web3FormsAccessKey} />
                <input type="hidden" name="subject" value="Nuevo contacto - raw.vives" />
                <input
                  type="checkbox"
                  name="botcheck"
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="contact-name">
                      {dictionary.form.name}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      minLength={2}
                      maxLength={80}
                      required
                      onInput={() => clearFieldError("name")}
                      aria-invalid={!!formErrors.name}
                      aria-describedby={formErrors.name ? "contact-name-error" : undefined}
                      className="rv-field"
                    />
                    {formErrors.name && (
                      <p id="contact-name-error" className={errorClass} role="alert">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="contact-email">
                      {dictionary.form.email}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={120}
                      required
                      onInput={() => clearFieldError("email")}
                      aria-invalid={!!formErrors.email}
                      aria-describedby={formErrors.email ? "contact-email-error" : undefined}
                      className="rv-field"
                    />
                    {formErrors.email && (
                      <p id="contact-email-error" className={errorClass} role="alert">
                        {formErrors.email}
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
                    name="message"
                    rows={6}
                    minLength={10}
                    maxLength={2000}
                    required
                    onInput={() => clearFieldError("message")}
                    aria-invalid={!!formErrors.message}
                    aria-describedby={formErrors.message ? "contact-message-error" : undefined}
                    className="rv-field resize-y"
                  />
                  {formErrors.message && (
                    <p id="contact-message-error" className={errorClass} role="alert">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                {status}
                <p className="rv-body-sm text-[var(--color-text-muted)]">
                  {dictionary.privacyNotice}{" "}
                  <Link className="rv-editorial-link" href={`/${locale}/privacidad`}>
                    {dictionary.form.privacy_link}
                  </Link>
                </p>
                <Button type="submit" size="lg" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? dictionary.form.sending : dictionary.form.send}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={(event) => submit(event, "license")}
                action="https://api.web3forms.com/submit"
                method="POST"
                className="space-y-6"
              >
                <input type="hidden" name="access_key" value={web3FormsAccessKey} />
                <input type="hidden" name="subject" value="Solicitud de licencia - raw.vives" />
                <input
                  type="checkbox"
                  name="botcheck"
                  className="sr-only"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="license-name">{dictionary.form.name}</label>
                    <input id="license-name" name="name" autoComplete="name" minLength={2} maxLength={80} required onInput={() => clearFieldError("name")} aria-invalid={!!formErrors.name} aria-describedby={formErrors.name ? "license-name-error" : undefined} className="rv-field" />
                    {formErrors.name && <p id="license-name-error" className={errorClass} role="alert">{formErrors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="license-email">{dictionary.form.email}</label>
                    <input id="license-email" name="email" type="email" autoComplete="email" maxLength={120} required onInput={() => clearFieldError("email")} aria-invalid={!!formErrors.email} aria-describedby={formErrors.email ? "license-email-error" : undefined} className="rv-field" />
                    {formErrors.email && <p id="license-email-error" className={errorClass} role="alert">{formErrors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-company">{dictionary.form.company}</label>
                  <input id="license-company" name="company" autoComplete="organization" maxLength={120} className="rv-field" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-photo">{dictionary.form.photo_id}</label>
                  <input id="license-photo" name="photoId" maxLength={120} required onInput={() => clearFieldError("photoId")} aria-invalid={!!formErrors.photoId} aria-describedby={formErrors.photoId ? "license-photo-error" : undefined} className="rv-field" />
                  {formErrors.photoId && <p id="license-photo-error" className={errorClass} role="alert">{formErrors.photoId}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-usage">{dictionary.form.usage_type}</label>
                  <div className="relative">
                    <select id="license-usage" name="usageType" required onChange={() => clearFieldError("usageType")} aria-invalid={!!formErrors.usageType} aria-describedby={formErrors.usageType ? "license-usage-error" : undefined} className="rv-field appearance-none pr-10">
                      <option value="">{dictionary.form.usage_type}</option>
                      <option value="commercial">{dictionary.form.usage_commercial}</option>
                      <option value="editorial">{dictionary.form.usage_editorial}</option>
                      <option value="personal">{dictionary.form.usage_personal}</option>
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  </div>
                  {formErrors.usageType && <p id="license-usage-error" className={errorClass} role="alert">{formErrors.usageType}</p>}
                </div>
                <div>
                  <label className={labelClass} htmlFor="license-description">{dictionary.form.usage_description}</label>
                  <textarea id="license-description" name="description" rows={5} minLength={10} maxLength={2000} required onInput={() => clearFieldError("description")} aria-invalid={!!formErrors.description} aria-describedby={formErrors.description ? "license-description-error" : undefined} className="rv-field resize-y" />
                  {formErrors.description && <p id="license-description-error" className={errorClass} role="alert">{formErrors.description}</p>}
                </div>
                {status}
                <p className="rv-body-sm text-[var(--color-text-muted)]">
                  {dictionary.privacyNotice}{" "}
                  <Link className="rv-editorial-link" href={`/${locale}/privacidad`}>
                    {dictionary.form.privacy_link}
                  </Link>
                </p>
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
    </section>
  );
}
