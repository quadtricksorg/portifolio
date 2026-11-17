import { z } from "zod";

import { CATEGORIES, categoryLabels, type Category } from "@/lib/categories";

export { CATEGORIES, categoryLabels, type Category };
export const categorySchema = z.enum(CATEGORIES);

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ImageAsset = z.infer<typeof imageSchema>;

/** Optional long-form blocks for flagship projects. Only rendered when present. */
const flagshipBlocksSchema = z
  .object({
    video: z
      .object({
        src: z.string().min(1),
        poster: z.string().min(1),
        caption: z.string().optional(),
      })
      .optional(),
    beforeAfter: z
      .object({ before: imageSchema, after: imageSchema, caption: z.string().optional() })
      .optional(),
    timeline: z
      .array(z.object({ stage: z.string(), detail: z.string() }))
      .min(2)
      .optional(),
    /** Only verified outcomes supplied by the client. Never invented. */
    outcome: z.string().min(1).optional(),
    /** Only real, attributable quotes. */
    quote: z
      .object({ text: z.string().min(1), author: z.string().min(1), role: z.string().min(1) })
      .optional(),
  })
  .strict();

export const projectSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
    title: z.string().min(1),
    client: z.string().min(1),
    category: categorySchema,
    /** Optional: hidden when not given. */
    year: z.number().int().min(2015).max(2100).optional(),
    summary: z.string().min(1),
    challenge: z.string().min(1),
    solution: z.string().min(1),
    services: z.array(z.string().min(1)).min(1),
    /** Optional: the Technology block is hidden when empty. */
    tech: z.array(z.string().min(1)).default([]),
    /** Live website or app store link. Leave "" until known; the button is hidden while empty. */
    liveUrl: z.union([z.literal(""), z.string().url()]).default(""),
    cover: imageSchema,
    gallery: z.array(imageSchema).default([]),
    /** True when the images are illustrative concepts, not screenshots of the shipped product. */
    conceptVisuals: z.boolean().default(false),
    featured: z.boolean().default(false),
    flagship: flagshipBlocksSchema.optional(),
    /** Client permission to publish must be on record. */
    published: z.boolean().default(true),
  })
  .strict();

export type Project = z.infer<typeof projectSchema>;
export type ProjectInput = z.input<typeof projectSchema>;

export const serviceSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: categorySchema,
    index: z.string().length(2),
    name: z.string().min(1),
    shortName: z.string().min(1),
    /** One plain-English line, used on cards and the service hero. */
    promise: z.string().min(1),
    description: z.string().min(1),
    useCases: z.array(z.object({ title: z.string(), detail: z.string() })).length(3),
    deliverables: z.array(z.string().min(1)).min(4),
    process: z.array(z.object({ stage: z.string(), detail: z.string() })).min(4).max(5),
    tech: z.array(z.string().min(1)).min(3),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).min(4).max(6),
    seo: z.object({ title: z.string().min(1), description: z.string().min(1) }),
  })
  .strict();

export type Service = z.infer<typeof serviceSchema>;
