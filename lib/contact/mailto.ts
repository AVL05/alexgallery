import { contactEmail } from "@/lib/site-config";
import type { ContactDictionary } from "@/types/dictionary";
import type { ContactFormValues, LicenseFormValues } from "./validation";

export function buildContactMailto(values: ContactFormValues | LicenseFormValues, dictionary: ContactDictionary) {
  const labels = dictionary.form;
  const lines = [`${labels.name}: ${values.name}`, `${labels.email}: ${values.email}`];
  const license = !("message" in values);
  if ("message" in values) {
    lines.push("", values.message);
  } else {
    const usage = { commercial: labels.usage_commercial, editorial: labels.usage_editorial, personal: labels.usage_personal };
    if (values.company) lines.push(`${labels.company}: ${values.company}`);
    lines.push(`${labels.photo_id}: ${values.photoId}`, `${labels.usage_type}: ${usage[values.usageType as keyof typeof usage] ?? values.usageType}`, "", values.description);
  }
  const subject = `${license ? dictionary.license : dictionary.general} — raw.vives`;
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\r\n"))}`;
}
