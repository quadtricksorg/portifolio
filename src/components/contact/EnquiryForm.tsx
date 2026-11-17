"use client";

import Script from "next/script";
import { useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { serviceOptions, type ContactFieldErrors } from "@/lib/contact";
import { site } from "@/content/site";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type EnquiryFormProps = {
  defaultService?: string;
  /** Hides the company field for shorter, in-page forms. */
  compact?: boolean;
  className?: string;
};

export function EnquiryForm({ defaultService = "not-sure", compact, className }: EnquiryFormProps) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    payload.turnstileToken = (fd.get("cf-turnstile-response") as string) ?? undefined;

    setStatus("submitting");
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; fieldErrors?: ContactFieldErrors };
      if (!res.ok || !data.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        // Move focus to the first invalid field.
        const first = data.fieldErrors && Object.keys(data.fieldErrors)[0];
        if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError(`We could not reach the server. Please check your connection or email ${site.contact.email}.`);
      setStatus("error");
    }
  }

  const err = (k: keyof ContactFieldErrors) => fieldErrors[k];
  const describedBy = (k: keyof ContactFieldErrors) => (err(k) ? `${id(k)}-error` : undefined);

  return (
    <div className={cn("relative", className)}>
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />}

      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="chamfer flex flex-col items-start gap-4 border border-border bg-bg p-8 sm:p-10"
          >
            <Label indicator>Message sent</Label>
            <p className="font-display text-h3 text-fg">Thank you. We&rsquo;ll be in touch {site.contact.responseTime}.</p>
            <p className="text-fg-muted">A member of the team will reply to the email address you gave us.</p>
            <Button variant="secondary" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="grid gap-5 sm:grid-cols-2"
            aria-describedby={error ? id("form-error") : undefined}
          >
            <Field label="Your name" htmlFor={id("name")} error={err("name")}>
              <Input id={id("name")} name="name" autoComplete="name" required aria-invalid={!!err("name")} aria-describedby={describedBy("name")} />
            </Field>
            <Field label="Email" htmlFor={id("email")} error={err("email")}>
              <Input
                id={id("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-invalid={!!err("email")}
                aria-describedby={describedBy("email")}
              />
            </Field>

            {!compact && (
              <Field label="Company" htmlFor={id("company")} optional error={err("company")}>
                <Input id={id("company")} name="company" autoComplete="organization" />
              </Field>
            )}

            <Field label="What do you need?" htmlFor={id("service")} error={err("service")} className={compact ? "sm:col-span-2" : undefined}>
              <Select id={id("service")} name="service" defaultValue={defaultService} aria-invalid={!!err("service")}>
                {serviceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Tell us about your project" htmlFor={id("message")} error={err("message")} hint="Goals, timeline, links, anything useful." className="sm:col-span-2">
              <Textarea
                id={id("message")}
                name="message"
                required
                rows={compact ? 4 : 6}
                aria-invalid={!!err("message")}
                aria-describedby={describedBy("message") ?? `${id("message")}-hint`}
              />
            </Field>

            {/* Honeypot: hidden from people and assistive tech. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor={id("website")}>Leave this field empty</label>
              <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {TURNSTILE_SITE_KEY && <div className="cf-turnstile sm:col-span-2" data-sitekey={TURNSTILE_SITE_KEY} data-theme="auto" />}

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-fg-subtle">
                We only use your details to reply. See our{" "}
                <a href="/privacy" className="underline underline-offset-4 hover:text-fg">
                  privacy policy
                </a>
                .
              </p>
              <Button type="submit" size="lg" indicator disabled={status === "submitting"} aria-busy={status === "submitting"} className="w-full sm:w-auto">
                {status === "submitting" ? (
                  <>
                    <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending
                  </>
                ) : (
                  "Send enquiry"
                )}
              </Button>
            </div>

            {status === "error" && error && (
              <p id={id("form-error")} role="alert" className="border-l-2 border-red-500 pl-4 text-sm text-fg sm:col-span-2">
                {error}
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
