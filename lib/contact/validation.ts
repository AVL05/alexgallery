export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  botcheck?: string;
};

export type LicenseFormValues = {
  name: string;
  email: string;
  company?: string;
  photoId: string;
  usageType: string;
  description: string;
  botcheck?: string;
};

export type ContactValidationMessages = {
  name: string;
  email: string;
  message: string;
  photo_id: string;
  usage_type: string;
  usage_description: string;
};

export type ContactFieldErrors = Partial<
  Record<keyof ContactFormValues | keyof LicenseFormValues, string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isLengthBetween(value: string, minimum: number, maximum: number) {
  const length = value.trim().length;
  return length >= minimum && length <= maximum;
}

export function validateContactForm(
  values: ContactFormValues,
  messages: ContactValidationMessages,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  if (!isLengthBetween(values.name, 2, 80)) errors.name = messages.name;
  if (!emailPattern.test(values.email.trim()) || values.email.trim().length > 120) {
    errors.email = messages.email;
  }
  if (!isLengthBetween(values.message, 10, 2000)) errors.message = messages.message;
  return errors;
}

export function validateLicenseForm(
  values: LicenseFormValues,
  messages: ContactValidationMessages,
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  if (!isLengthBetween(values.name, 2, 80)) errors.name = messages.name;
  if (!emailPattern.test(values.email.trim()) || values.email.trim().length > 120) {
    errors.email = messages.email;
  }
  if (!isLengthBetween(values.photoId, 1, 120)) errors.photoId = messages.photo_id;
  if (!isLengthBetween(values.usageType, 1, 40)) errors.usageType = messages.usage_type;
  if (!isLengthBetween(values.description, 10, 2000)) {
    errors.description = messages.usage_description;
  }
  return errors;
}
