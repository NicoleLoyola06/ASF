# Tutorial: Animaciones GSAP Paso a Paso

**Objetivo**: Entender cómo funcionan las animaciones y cómo replicarlas en tu sitio

---

## 📚 Conceptos Fundamentales

### ¿Qué es GSAP?
**GSAP** (GreenSock Animation Platform) es una librería JavaScript para crear animaciones suaves y complejas.

**Ventajas sobre CSS puro**:
- ✅ Más control (easing, delays, stagger)
- ✅ Animaciones scroll-linked (paralax)
- ✅ Number counters
- ✅ Timeline (secuencias de animaciones)
- ✅ Mejor performance que CSS en casos complejos

**Versión instalada**: `gsap` (módulo npm)

---

## 🎯 Estructura Base

```javascript
import gsap from 'gsap';

// Animar un elemento
gsap.to('.elemento', {
  duration: 0.8,        // Duración en segundos
  opacity: 1,           // A qué estado animar
  y: 0,                 // Distancia en pixels (translateY)
  ease: 'power2.out',   // Tipo de ease (suavidad)
  delay: 0.2            // Esperar antes de empezar
});
```

**Breakdown**:
- `gsap.to()` = Anima DESDE estado actual HASTA los valores especificados
- `gsap.from()` = Anima DESDE los valores especificados HASTA estado actual
- `gsap.fromTo()` = Especifica ambos (inicio y fin)

---

## 1️⃣ ANIMACIÓN 1: Page Load (Hero)

**Referencia**: reformcollective.com  
**Archivo**: `src/utils/animations.ts` → función `heroPageLoad()`

### ¿Qué hace?
Cuando carga la página, el hero aparece con fade-in + escala pequeña → grande.

### Código paso a paso

```javascript
export function heroPageLoad() {
  // 1. Crea una "timeline" (secuencia de animaciones)
  const tl = gsap.timeline();

  // 2. Primera animación: la copia (h1, párrafo, botones)
  tl.from('.hero__copy', {
    duration: 0.8,           // 0.8 segundos
    opacity: 0,              // Comienza invisible
    scale: 0.95,             // Comienza pequeño (95% del tamaño)
    ease: 'power2.out'       // Suavidad: comienza rápido, termina lento
  });

  // 3. Segunda animación: el visual (círculos + estrella)
  // "-=0.6" = comienza 0.6s ANTES del fin de la anterior
  // (resultado: comienza 0.2s después del inicio)
  tl.from('.hero__visual', {
    duration: 0.8,
    opacity: 0,
    scale: 0.95,
    ease: 'power2.out'
  }, "-=0.6");
}
```

### ¿Cómo funciona?

**Paso 1**: `gsap.timeline()` crea una secuencia
```
Timeline:
├─ 0.0s-0.8s: .hero__copy anima
└─ 0.2s-1.0s: .hero__visual anima (comienza en 0.2s)
```

**Paso 2**: `tl.from()` = anima DESDE los valores (0 opacidad) HASTA el estado actual (opacidad 1)

**Paso 3**: `-=0.6` crea overlap (la segunda anim comienza mientras la primera termina)

### Easing (suavidad)

```javascript
'power2.out'  // Comienza rápido, termina LENTO (como si "rebota")
'power2.in'   // Comienza lento, termina RÁPIDO
'power2.inOut' // Lento → rápido → lento
```

Visualiza en: https://gsap.com/docs/v3/Eases

---

## 2️⃣ ANIMACIÓN 2: Section Header Lines

**Referencia**: untold.site/en - "about brands con la linea"  
**Archivo**: `src/utils/animations.ts` → función `sectionHeaderLines()`

### ¿Qué hace?
Cada sección tiene un SVG line debajo del título que se "dibuja" de izq → derecha al scrollear.

### Código paso a paso

```javascript
export function sectionHeaderLines() {
  // 1. Selecciona TODOS los SVG lines
  const lines = document.querySelectorAll('.section-line line');

  // 2. Para cada línea:
  lines.forEach((line, index) => {
    // 3. Calcula el largo total del SVG line
    const length = (line as SVGLineElement).getTotalLength();

    // 4. Configura estado INICIAL
    // strokeDasharray = "dibuja una línea punteada"
    // strokeDashoffset = "desplaza el patrón"
    gsap.set(line, {
      strokeDasharray: length,    // 200px de patrón
      strokeDashoffset: length    // Todo desplazado (invisible)
    });

    // 5. Anima: el offset va de length → 0 (línea aparece)
    gsap.to(line, {
      strokeDashoffset: 0,        // Offset a 0 = línea visible
      duration: 0.6,
      ease: 'power2.out',
      delay: index * 0.15,        // Cada línea con 0.15s de delay
      scrollTrigger: {
        trigger: line.closest('.section-head'),
        start: 'top 80%',         // Comienza cuando section-head está al 80% del viewport
        once: true                // Solo anima una vez
      }
    });
  });
}
```

### ¿Cómo funciona?

**SVG Stroke Animation**:
```
strokeDasharray = 200px   (largo total)
strokeDashoffset = 200px  (desplazado 200px = invisible)
             ↓ anima ↓
strokeDashoffset = 0px    (desplazado 0 = visible)

Resultado: Línea se "dibuja" de izq → der
```

**ScrollTrigger**:
```javascript
scrollTrigger: {
  trigger: '.section-head',     // Observa este elemento
  start: 'top 80%',             // Dispara cuando top toca 80% del viewport
  once: true                    // Solo una vez
}
```

---

## 3️⃣ ANIMACIÓN 3: Valores Staggered

**Referencia**: untold.site/en - "stories that…"  
**Archivo**: `src/utils/animations.ts` → función `valoresStagger()`

### ¿Qué hace?
Cada valor (4 tarjetas) aparece con fade-in + slideUp, pero con delay entre cada una.

### Código paso a paso

```javascript
export function valoresStagger() {
  // 1. Selecciona todos los .valor
  gsap.from('.valor', {
    duration: 0.5,            // Cada tarjeta anima 0.5s
    opacity: 0,               // Comienza invisible
    y: 30,                    // Comienza 30px abajo
    ease: 'power2.out',
    stagger: 0.1,             // ⭐ CLAVE: delay de 0.1s ENTRE tarjetas
    scrollTrigger: {
      trigger: '.grid.grid-4.valores',
      start: 'top 80%',
      once: true
    }
  });
}
```

### Stagger explicado

Sin stagger:
```
Tarjeta 1 anima: 0.0s-0.5s
Tarjeta 2 anima: 0.0s-0.5s  ← Simultáneamente!
Tarjeta 3 anima: 0.0s-0.5s
Tarjeta 4 anima: 0.0s-0.5s
```

Con `stagger: 0.1`:
```
Tarjeta 1 anima: 0.0s-0.5s
Tarjeta 2 anima: 0.1s-0.6s  ← 0.1s después
Tarjeta 3 anima: 0.2s-0.7s  ← 0.2s después
Tarjeta 4 anima: 0.3s-0.8s  ← 0.3s después

Resultado: Ola de entrada suave → moderna
```

---

## 4️⃣ ANIMACIÓN 4: Button Ripple (Hover)

**Referencia**: cutthecode.com  
**Archivo**: `src/utils/animations.ts` → función `buttonRipple()`

### ¿Qué hace?
Al pasar el mouse sobre un botón, aparece un círculo que crece y desaparece (efecto "onda").

### Código paso a paso

```javascript
export function buttonRipple() {
  // 1. Selecciona todos los botones
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    // 2. Escucha mouseenter (cuando entra el mouse)
    btn.addEventListener('mouseenter', (e) => {
      // 3. Calcula posición del mouse DENTRO del botón
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;

      // 4. Crea un elemento ripple (círculo temporal)
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.pointerEvents = 'none';

      // 5. Agrega el ripple al botón
      (btn as HTMLElement).appendChild(ripple);

      // 6. Anima el ripple
      gsap.to(ripple, {
        width: 300,                // Crece a 300px
        height: 300,
        left: x - 150,             // Se centra en el punto de entrada
        top: y - 150,
        opacity: 0,                // Se desvanece
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove();         // Elimina el elemento cuando termina
        }
      });
    });
  });
}
```

### ¿Cómo funciona?

**Timeline visual**:
```
Tiempo:  0ms    200ms    400ms    600ms
       start    crece    desvanece  remove

Ripple:  •       •••      •••••      (removido)
          ↓       ↓↓↓      ↓↓↓↓↓
         opacity opacity   opacity
         scale   scale     0 → 0
```

---

## 5️⃣ ANIMACIÓN 5: Number Counter

**Referencia**: vwlab.io/pages/showcase  
**Archivo**: `src/utils/animations.ts` → función `impactoCounter()`

### ¿Qué hace?
Los números de impacto (40+, 2,500+, etc) se animan "contando" desde 0 hasta el valor final.

### Código paso a paso

```javascript
export function impactoCounter() {
  const counters = document.querySelectorAll('.impacto-card__value');

  counters.forEach((counter, index) => {
    // 1. Extrae el número final (40, 2500, 15, 50)
    const finalValue = parseInt((counter as HTMLElement).textContent || '0') || 0;
    const displayText = (counter as HTMLElement).textContent;

    // 2. Anima contando desde 0 → finalValue
    gsap.to(counter, {
      duration: 2,
      textContent: finalValue,    // Anima el TEXTO (no CSS, sino el contenido HTML)
      snap: { textContent: 1 },   // Snaps a números enteros (0, 1, 2... no decimales)
      stagger: 0.1,               // Cada counter inicia 0.1s después
      ease: 'power1.out',
      delay: index * 0.15,
      scrollTrigger: {
        trigger: '.impacto-grid',
        start: 'top 70%',
        once: true
      },
      // 3. Callback: agrega el sufijo (+) después del número
      onUpdate: function() {
        const current = Math.ceil((counter as any)._gsap.targets[0].textContent);
        (counter as HTMLElement).textContent = current + (displayText?.includes('+') ? '+' : '');
      }
    });
  });
}
```

### Cómo funciona `textContent`

```javascript
// En lugar de animar propiedades CSS (opacity, y, etc)
// GSAP anima el TEXTO del elemento

Inicio:   textContent = "0"
0.5s:     textContent = "20"
1.0s:     textContent = "40"
1.5s:     textContent = "60"
2.0s:     textContent = "40" (el valor final, 40)

Resultado: Número cuenta de 0 → 40
```

---

## 📍 Cómo Ejecutar Todas las Animaciones

### Paso 1: Ver estructura
```
src/
├── utils/
│   └── animations.ts      ← Todas las funciones
├── layouts/
│   └── Layout.astro       ← Importa y llama initAllAnimations()
└── styles/
    └── global.css         ← @keyframes CSS
```

### Paso 2: La función `initAllAnimations()`
```javascript
// En animations.ts:
export function initAllAnimations() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAnimations);
  } else {
    runAnimations();
  }
}

function runAnimations() {
  heroPageLoad();           // 1. Carga página
  sectionHeaderLines();     // 2. Líneas de secciones
  valoresStagger();         // 3. Valores
  buttonRipple();           // 4. Botones
  impactoCounter();         // 5. Números
  testimoniosBlurReveal();  // 6. Testimonios
  articulosParallax();      // 7. Artículos
  customCursor();           // 8. Cursor
}
```

### Paso 3: Se ejecuta en Layout.astro
```html
<!-- En Layout.astro: -->
<script>
  import { initAllAnimations } from '@/utils/animations';
  initAllAnimations();
</script>
```

---

## ✅ Verificar que funciona

### En dev server:
```bash
npm run dev
# Abre http://localhost:4327
```

### Checklist:
- [ ] Al cargar página: hero aparece con fade-in
- [ ] Scroll a "Nuestros valores": tarjetas aparecen una por una
- [ ] Hover sobre botones: ripple effect visible
- [ ] Scroll a "Nuestro impacto": números cuentan
- [ ] Hover sobre testimonios: blur → sharp
- [ ] Scroll en artículos: se mueven (parallax)
- [ ] Mouse se mueve: ves el cursor personalizado

---

## 🎯 Próximas Animaciones

Ya implementadas:
1. ✅ Page Load (Hero)
2. ✅ Section Header Lines
3. ✅ Valores Stagger
4. ✅ Button Ripple
5. ✅ Number Counter
6. ✅ Testimonios Blur
7. ✅ Artículos Parallax
8. ✅ Custom Cursor

**Falta CSS-only**:
- Typing animation (ya en global.css, lista para usar)

**Cómo usar typing**:
```html
<p class="typing-animation">
  Tu texto que se escribe letra por letra...
</p>
```

---

## 🚀 Próximo Paso

**Test en dev server y me cuentas**:
1. ¿Ves el hero aparecer suavemente al cargar?
2. ¿Los botones tienen efecto ripple al hover?
3. ¿Los números cuentan al scroll?

Si todo funciona → continuamos con ajustes finos  
Si algo no funciona → debuggeamos juntos

¿Listo?
