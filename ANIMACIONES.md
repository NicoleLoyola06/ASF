# Animaciones del sitio ASF

Código: `src/utils/animations.ts` · Estilos: bloque "ANIMACIONES (GSAP)" en `src/styles/global.css`

---

## Qué se implementó y de dónde sale

| # | Animación | Referencia de marca | Dónde se ve |
|---|-----------|--------------------|-------------|
| 1 | Cortina de apertura | reformcollective.com | Solo al entrar al sitio (una vez por pestaña) |
| 2 | Título que sube desde una máscara, palabra por palabra | aidigital.com ("We are AI digital") | H1 del hero y cada H2 de sección |
| 3 | Línea que se traza bajo el título | untold.site ("about brands con la línea") | Bajo cada H2 de sección |
| 4 | Escritura progresiva de textos secundarios | untold.site | Párrafos descriptivos bajo cada H2 |
| 5 | Entrada escalonada de bloques | untold.site ("stories that…") | Valores, servicios, impacto, testimonios |
| 6 | Conteo numérico | vwlab.io | Sección "Nuestro impacto" |
| 7 | Desplazamiento vertical al hacer scroll | giannantoniodemalde.com | Tarjetas de artículos |
| 8 | Cursor con lag | untold.site | Todo el sitio (solo en escritorio) |

---

## Qué deberías ver, en orden

**1. Al entrar al sitio (≈1.5 s)**
Pantalla azul profundo que cubre todo. Un círculo turquesa crece en el centro y se contrae. La pantalla azul **sube y sale** dejando ver el sitio.

Ocurre **una sola vez por pestaña**. Al navegar entre páginas ya no aparece: el hero entra directo. Para volver a verla, abre el sitio en una pestaña nueva (o cierra y reabre esa).

**2. Inmediatamente después**
El título *"La adolescencia sin mitos, con evidencia."* aparece **palabra por palabra, subiendo desde abajo**, como si cada palabra saliera de detrás de una línea invisible. No es un fundido: es un movimiento vertical con recorte.

**3. Al bajar a cualquier sección**
- El H2 sube palabra por palabra igual que el hero.
- Debajo del H2 aparece una **línea turquesa de 72 px que se dibuja de izquierda a derecha**.
- El párrafo descriptivo se revela palabra por palabra, más rápido y más sutil.

**4. Valores / servicios / testimonios**
Las tarjetas suben 40 px y aparecen **una tras otra**, no todas a la vez.

**5. "Nuestro impacto"**
Los números cuentan desde 0: `0 → 40+`, `0 → 2,500+`, `0 → 15+`, `0 → 50+`. Duran 1.8 s.

**6. Artículos**
Al hacer scroll, las tarjetas se desfasan verticalmente entre sí (efecto de profundidad ligado a la barra de scroll).

**7. Cursor (solo escritorio)**
El cursor del sistema desaparece. Queda un **punto azul pequeño** que sigue al mouse casi exacto, y un **anillo de 40 px** que lo persigue con retraso. Sobre enlaces y botones el anillo **crece al doble**.

---

## Si algo no se ve

Abre la consola del navegador (F12 → Console) y busca errores en rojo.

- **No pasa absolutamente nada** → el script no cargó. Verifica que `dist/_astro/Layout.astro_astro_type_script_*.js` existe tras `npm run build`.
- **Todo aparece de golpe, sin cortina ni máscaras** → tienes activado "reducir movimiento" en el sistema operativo. Es intencional: el sitio lo respeta y muestra todo sin animar. Para probar las animaciones, desactívalo en Windows: *Configuración → Accesibilidad → Efectos visuales → Efectos de animación*.
- **El cursor sigue siendo la flecha normal** → estás en un dispositivo táctil, o el navegador reporta `hover: none`. En escritorio con mouse debería reemplazarse.

---

## Accesibilidad

Todo el sistema respeta `prefers-reduced-motion: reduce`. Con esa preferencia activada no hay cortina, ni cursor personalizado, ni máscaras: el contenido se muestra estático y completo. Ningún texto depende de JavaScript para ser legible — las máscaras se aplican sobre texto que ya existe en el HTML.
