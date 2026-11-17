import nodemailer from "nodemailer";
import { contactSchema, serviceOptions, type ContactFieldErrors } from "@/lib/contact";
import { site } from "@/content/site";

/**
 * Contact form endpoint. Sends enquiries by SMTP (configured for Gmail).
 *
 * Environment variables:
 *  - SMTP_USER             Mailbox that sends the email, e.g. info.quadtricks@gmail.com (required in production)
 *  - SMTP_PASS             Gmail app password for that mailbox (required in production)
 *  - SMTP_HOST             Defaults to smtp.gmail.com
 *  - SMTP_PORT             Defaults to 465 (TLS)
 *  - CONTACT_TO            Inbox that receives enquiries (defaults to site.contact.email)
 *  - TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret (optional; enables bot check)
 */

async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Not configured: rely on honeypot only.
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/** Strips characters that could break out of an email header line. */
const headerSafe = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ContactFieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot gets a silent success so bots learn nothing.
    if (fieldErrors.website) return Response.json({ ok: true });
    return Response.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }

  const data = parsed.data;
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return Response.json({ ok: false, error: "We could not verify you are human. Please try again." }, { status: 400 });
  }

  const serviceLabel = serviceOptions.find((o) => o.value === data.service)?.label ?? data.service;
  const text = [
    `New enquiry from the ${site.name} website`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company: ${data.company || "-"}`,
    `Service: ${serviceLabel}`,
    "",
    data.message,
  ].join("\n");

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] SMTP_USER/SMTP_PASS not set; enquiry logged instead of emailed:\n" + text);
      return Response.json({ ok: true });
    }
    console.error("[contact] SMTP credentials are not configured.");
    return Response.json(
      { ok: false, error: `Our form is temporarily unavailable. Please email us at ${site.contact.email}.` },
      { status: 503 },
    );
  }

  try {
    const port = Number(process.env.SMTP_PORT ?? 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"${site.name} Website" <${user}>`,
      to: process.env.CONTACT_TO ?? site.contact.email,
      replyTo: { name: headerSafe(data.name), address: data.email },
      subject: headerSafe(`New enquiry: ${serviceLabel} from ${data.name}`),
      text,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json(
      { ok: false, error: `Something went wrong sending your message. Please email us at ${site.contact.email}.` },
      { status: 502 },
    );
  }
}
