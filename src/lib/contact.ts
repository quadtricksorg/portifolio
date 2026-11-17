import { z } from "zod";
import { services } from "@/content/services";

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.name })),
  { value: "not-sure", label: "Not sure yet" },
] as const;
export type ServiceOption = { value: string; label: string };

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(150).optional().default(""),
  service: z.enum(serviceValues, { message: "Please choose a service." }),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters).").max(5000),
  /** Honeypot. Must be empty. */
  website: z.string().max(0).optional().default(""),
  turnstileToken: z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;
