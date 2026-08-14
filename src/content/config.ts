import { defineCollection, z } from 'astro:content';

/*
  Schemas alineados a los campos que el flujo de Notion (ver Sitemmap/ASF-estructura-web.md)
  va a producir: cada colección corresponde a una base de datos de Notion con un
  toggle "Publicado" que controla si el registro se sincroniza al build de Astro.
  Por ahora el contenido vive como Markdown local; cuando se conecte Notion, el
  loader puede cambiarse a @astrojs/db o a un loader custom sin tocar el schema.
*/

const articulos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    author: z.string(),
    category: z.enum(['Psicología', 'Derechos Humanos', 'Educación', 'Salud']),
    publishDate: z.date(),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
  }),
});

const eventos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    location: z.string(),
    audience: z.string().optional(),
    coverImage: z.string().optional(),
    registrationUrl: z.string().optional(),
    published: z.boolean().default(true),
  }),
});

const proyectos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    institution: z.string(),
    year: z.string(),
    coverImage: z.string().optional(),
    stats: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
    published: z.boolean().default(true),
  }),
});

export const collections = { articulos, eventos, proyectos };
