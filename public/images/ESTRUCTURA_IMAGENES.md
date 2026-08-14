# Estructura de Carpetas para Imágenes

Este directorio está organizado para recibir contenido multimedia desde Notion.

## Carpetas y su Propósito

### `/proyectos`
Imágenes de portada/thumbnail para los proyectos de intervención social. Recomendado: **800×600px**, formato JPG/PNG.

### `/eventos`
Fotos de eventos, charlas, y actividades. Recomendado: **1200×675px**, formato JPG.

### `/articulos`
Imágenes de portada/featured para artículos. Recomendado: **1000×600px**, formato JPG/PNG.

### `/equipo`
Fotos de miembros del equipo y comisiones. Recomendado: **400×400px** (cuadrado), formato JPG con fondo neutro.

### `/testimonios`
Fotos de personas que ofrecen testimonios (educadores, estudiantes, aliados). Recomendado: **200×200px** (circular), formato JPG.

### `/icons`
Íconos de marca (ya completo con 10 íconos 1-10.png). No editar - solo lectura.

## Instrucciones de Carga

1. Desde Notion, exportar imágenes a carpetas según su categoría
2. Renombrar archivos con formato: `{entidad}-{id}.{ext}` (ej: `proyecto-01.jpg`, `evento-taller-abr-2024.jpg`)
3. Optimizar tamaño antes de subir (máximo 2MB por archivo)
4. Verificar que las imágenes respeten los lineamientos de marca del manual de identidad

## Validación

Una vez subidas, el sitio Astro recogerá las imágenes automáticamente desde Notion y las renderizará en:
- Carousels de proyectos en `/proyectos`
- Timeline de eventos en `/eventos`
- Grillas de artículos en `/articulos`
- Perfiles del equipo en `/quienes-somos`
