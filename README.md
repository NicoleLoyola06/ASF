# Adolescencias Sin Ficciones — Sitio Web

Sitio institucional de **Adolescencias Sin Ficciones (ASF)**, agrupación estudiantil peruana dedicada a desmitificar la adolescencia mediante evidencia, educación y acción social.

## Stack

- [Astro](https://astro.build) — framework de sitio estático
- CSS nativo con variables de diseño (sin frameworks de CSS)
- [Vercel](https://vercel.com) — hosting y despliegue continuo
- [Notion](https://notion.so) — CMS futuro para community managers (artículos, eventos, proyectos)

## Estructura

```
src/
  components/       Header, Footer y piezas reutilizables
  content/          Content collections (articulos, eventos, proyectos)
  layouts/          Layout base (SEO, fuentes, estructura HTML)
  pages/            Rutas del sitio (ver sitemap abajo)
  styles/           tokens.css (diseño) + global.css (reset y utilidades)
public/
  images/           Logo e íconos de marca
```

## Sitemap

| Página | Ruta | Estado |
|---|---|---|
| Inicio | `/` | ✅ |
| Quiénes Somos | `/quienes-somos` | ✅ |
| Ideario | `/ideario` | ✅ |
| Proyectos | `/proyectos` | ✅ |
| Artículos | `/articulos` | ✅ |
| Artículo individual | `/articulos/[slug]` | ✅ |
| Eventos | `/eventos` | ✅ |
| Evento individual | `/eventos/[slug]` | ✅ |
| Reconocimientos | `/reconocimientos` | ✅ |
| Contacto | `/contacto` | ✅ |

## Identidad visual

- **Colores:** Turquesa `#81C1C3`, Beige `#E9D2BD`, Azul profundo `#007B8C`, Azul oscuro `#2F4F6B`, Fondo institucional `#EEEEEE`
- **Tipografías:** Marykate (títulos), Glacial Indifference (subtítulos), Barlow (cuerpo). Ver `src/styles/tokens.css`.
- **Iconografía:** figuras geométricas circulares y estrellas. Regla de oro: no recargar.
- **Fotografía:** solo en reseñas, convocatorias abiertas y cobertura de eventos. El resto del sitio es tipográfico/ilustrativo hasta que se suban fotos reales vía Notion.

## Desarrollo local

```bash
npm install
npm run dev
```

## Flujo de contenido (futuro, vía Notion)

```
Community Manager → Notion → toggle "Publicado" → Vercel detecta el cambio → web actualizada
```

## Flujo de despliegue

```
VS Code → git add / commit / push → GitHub → Vercel build → web pública actualizada
```

## Links del proyecto

| Qué | Link |
|---|---|
| Repositorio | github.com/NicoleLoyola06/ASF |
| Dominio sugerido | asfperu.org |
| Contacto | adolescenciassinficciones@gmail.com |
