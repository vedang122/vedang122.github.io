import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tag: z.enum([
      "Practice",
      "Workflow",
      "Engineering",
      "Postmortem",
      "Startups",
      "LLMs",
      "Fitness",
      "Meta",
    ]),
    draft: z.boolean().default(false),
    /** Optional explicit canonical URL (defaults to vedangkarwa.com/posts/<slug>) */
    canonical: z.string().url().optional(),
  }),
});

export const collections = { posts };
