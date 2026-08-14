# Plan de Animaciones - ASF Website

**Basado en referencias de sitios profesionales**  
**Objetivo**: Transitar de sitio estático a experiencia envolvente sin perder accesibilidad

---

## 📍 Mapeo de Animaciones por Sección

### **1. HERO (Página de Inicio)**
**Referencia**: reformcollective.com + aidigital.com

#### A) **Page Load Animation** (reformcollective.com)
- **Qué es**: Animación de entrada cuando carga la página
- **Técnica**: Fade-in + scale del contenido hero desde 0.9 → 1
- **Duración**: 0.8s ease-out
- **Implementar en**: 
  - Hero copy (h1, p, buttons)
  - Hero visual (circles + star)
  - Staggered: copy primero, visual 0.2s después

**Código esperado**:
```css
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.hero__copy {
  animation: fadeInScale 0.8s ease-out forwards;
}

.hero__visual {
  animation: fadeInScale 0.8s ease-out 0.2s forwards;
}
```

#### B) **Title Animation** (aidigital.com)
- **Qué es**: El h1 "La adolescencia sin mitos..." aparece con reveal de letras
- **Técnica**: Reveal line-by-line O word-by-word (staggered)
- **Duración**: 1.2s total
- **Nota**: Inspirado en "We are AI Digital" que reveala cada palabra

**Código esperado**:
```css
.hero__copy h1 {
  /* Splits a words, anima cada una */
  animation: wordReveal 1.2s ease-out;
}

@keyframes wordReveal {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

---

### **2. SECTION HEADERS (Quiénes Somos, Proyectos, Eventos, Contacto)**
**Referencia**: untold.site/en - "about brands con la linea"

#### **Header Line Animation**
- **Qué es**: Línea decorativa debajo de títulos que "dibuja" de izq→der
- **Técnica**: SVG line stroke-dasharray + stroke-dashoffset animation
- **Duración**: 0.6s ease-out
- **Implementar en**: 
  - `<h2>` de cada sección principal
  - Debajo del título, una línea turquesa que aparece

**Código esperado**:
```html
<h2>Quiénes Somos</h2>
<svg class="section-line" viewBox="0 0 200 2">
  <line x1="0" y1="1" x2="200" y2="1" stroke="var(--color-turquesa)" />
</svg>
```

```css
.section-line line {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawLine 0.6s ease-out forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
```

---

### **3. VALORES (Cards de valores)**
**Referencia**: untold.site/en - "stories that…" (staggered reveal)

#### **Staggered Card Reveal**
- **Qué es**: Cada valor aparece con delay (como "historias que revelan")
- **Técnica**: Fade-in + slideUp con stagger nth-child
- **Duración**: 0.5s cada, delay 0.1s entre cards
- **Implementar en**: Grid de 4 valores

**Código esperado**:
```css
.valor {
  opacity: 0;
  animation: slideUpFade 0.5s ease-out forwards;
}

.valor:nth-child(1) { animation-delay: 0s; }
.valor:nth-child(2) { animation-delay: 0.1s; }
.valor:nth-child(3) { animation-delay: 0.2s; }
.valor:nth-child(4) { animation-delay: 0.3s; }

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### **4. IMPACTO (Números con iconos)**
**Referencia**: vwlab.io/pages/showcase (numbered animations 1,2,3,4)

#### **Number Counter Animation**
- **Qué es**: Números que "cuentan" desde 0 hasta valor final
- **Técnica**: GSAP CountUp OR CSS counter-increment
- **Duración**: 2s, trigger en scroll-into-view
- **Implementar en**: 
  - 40+ Talleres
  - 2,500+ Estudiantes
  - 15+ Instituciones
  - 50+ Artículos

**Código esperado (GSAP)**:
```js
// Cuando la sección es visible en viewport
gsap.to(".impacto-card__value", {
  duration: 2,
  textContent: 40,
  snap: { textContent: 1 },
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".impacto-grid",
    start: "top center",
    once: true
  }
});
```

**O CSS puro**:
```css
.impacto-card__value {
  counter-reset: num;
  animation: countUp 2s ease-out forwards;
}

@keyframes countUp {
  0% { counter-increment: num 0; }
  100% { counter-increment: num 40; }
}
```

---

### **5. TESTIMONIOS**
**Referencia**: untold.site/en - "stories that…" (revelan historias)

#### **Quote Reveal Animation**
- **Qué es**: Cada testimonial aparece con fade + blur effect
- **Técnica**: Blur → sharp + fade-in
- **Duración**: 0.7s staggered
- **Trigger**: On scroll into view

**Código esperado**:
```css
.testimonio-card {
  opacity: 0;
  filter: blur(10px);
  animation: blurReveal 0.7s ease-out forwards;
}

.testimonio-card:nth-child(1) { animation-delay: 0s; }
.testimonio-card:nth-child(2) { animation-delay: 0.15s; }
.testimonio-card:nth-child(3) { animation-delay: 0.3s; }

@keyframes blurReveal {
  from {
    opacity: 0;
    filter: blur(10px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}
```

---

### **6. ARTÍCULOS (Grid de artículos)**
**Referencia**: giannantoniodemalde.com - "animación que baja entre obras"

#### **Scroll-Linked Parallax + Stagger**
- **Qué es**: Mientras scrolleas, artículos bajan gradualmente (parallax suave)
- **Técnica**: GSAP ScrollTrigger con yPercent
- **Duración**: Continua con scroll
- **Implementar en**: Grid de 3 artículos

**Código esperado**:
```js
gsap.to(".article-card", {
  y: 100,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".articulos-grid",
    start: "top center",
    end: "bottom center",
    scrub: 1, // smooth scrub linked to scrollbar
  }
});
```

---

### **7. EVENTOS (Por qué asistir)**
**Referencia**: vwlab.io/pages/showcase - "animaciones 1,2,3,4"

#### **Sequential Icon + Text Reveal**
- **Qué es**: Eventos se revelan en secuencia (icono → texto)
- **Técnica**: Staggered fade-in + scale
- **Duración**: 0.5s cada
- **Implementar en**: Card de eventos (cuando haya contenido)

**Código esperado**:
```css
.evento-card__icon {
  opacity: 0;
  transform: scale(0.5);
  animation: iconPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.evento-card__content {
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.3s forwards;
}

@keyframes iconPop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

### **8. CURSOR CUSTOMIZADO**
**Referencia**: untold.site/en - "animación del cursor"

#### **Custom Cursor Tracking**
- **Qué es**: Cursor se convierte en círculo que sigue el mouse
- **Técnica**: JavaScript + CSS para tracer cursor
- **Implementar en**: Globally (todo el sitio)

**Código esperado**:
```html
<div class="cursor"></div>
<div class="cursor-follower"></div>
```

```css
.cursor {
  width: 8px;
  height: 8px;
  background: var(--color-turquesa);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
}

.cursor-follower {
  width: 40px;
  height: 40px;
  border: 2px solid var(--color-turquesa);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.3;
}
```

```js
let mouseX = 0, mouseY = 0;
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  
  // Follower sigue con delay
  gsap.to(follower, {
    left: mouseX - 20,
    top: mouseY - 20,
    duration: 0.6
  });
});
```

---

### **9. TEXTOS SECUNDARIOS (Descripciones)**
**Referencia**: untold.site/en - "animación de escritura"

#### **Text Typing Animation**
- **Qué es**: Descripción larga se "escribe" letra por letra
- **Técnica**: CSS steps() animation O JavaScript charByChar
- **Duración**: 1.5s
- **Implementar en**: 
  - Hero subtext
  - Descripciones de secciones
  - Descripciones de servicios

**Código esperado (CSS)**:
```css
.hero__subtext {
  max-width: 42ch;
  animation: typing 2s steps(100, end) forwards;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid var(--color-turquesa);
}

@keyframes typing {
  0% { width: 0; }
  100% { width: 100%; }
}

@keyframes blink {
  0%, 50% { border-right-color: var(--color-turquesa); }
  51%, 100% { border-right-color: transparent; }
}
```

---

### **10. CONTACTO (CTA Final + Form)**
**Referencia**: palermo.ddd.live - cutthecode.com (smooth interactions)

#### **Button Hover + Focus Animations**
- **Qué es**: Botones tienen efecto ripple / glow on hover
- **Técnica**: CSS ::after pseudo-element con animation
- **Duración**: 0.4s
- **Implementar en**: Todos los `.btn`

**Código esperado**:
```css
.btn {
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.btn:hover::after {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}
```

---

## 🛠️ Tecnologías a Usar

| Animación | Best Tool | Why |
|-----------|-----------|-----|
| **Fade-in / Scale** | CSS @keyframes | Lightweight, native |
| **Scroll-linked** | GSAP ScrollTrigger | Smooth, optimized |
| **Number counters** | GSAP CountUp | Precise, smooth |
| **Parallax** | GSAP ScrollTrigger | GPU-accelerated |
| **Cursor tracking** | JavaScript + GSAP | Smooth interpolation |
| **Text typing** | CSS steps() | No JS overhead |
| **Stagger** | CSS nth-child delays | Simple, performant |

---

## 📦 Instalación de Dependencias

```bash
npm install gsap
```

En tu archivo Astro:
```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

---

## ✅ Checklist de Implementación

- [ ] **Page Load**: Hero fade-in + scale (easy)
- [ ] **Title Animation**: H1 word-reveal (medium)
- [ ] **Section Headers**: Line draw animation (easy)
- [ ] **Valores**: Staggered reveal (easy)
- [ ] **Impacto**: Number counter (medium - needs GSAP)
- [ ] **Testimonios**: Blur reveal + stagger (easy)
- [ ] **Artículos**: Parallax scroll-linked (medium)
- [ ] **Cursor**: Custom tracking (medium)
- [ ] **Textos**: Typing animation (easy)
- [ ] **Botones**: Ripple effect (easy)

---

## 🎯 Prioridad de Implementación

### Fase 1 (Este sprint) — 80% del impacto
1. Page Load animation (hero)
2. Section header lines
3. Valores staggered reveal
4. Button ripple effects

### Fase 2 (Siguiente) — Refinamiento
5. Number counter (impacto)
6. Testimonios blur reveal
7. Cursor customizado

### Fase 3 (Polish) — Premium
8. Parallax artículos
9. Typing text
10. Advanced scroll interactions

---

## 🚀 Próximo Paso

¿Cuál es tu prioridad?

**A) Implementar Fase 1 completa** (4 animaciones = 80% impacto visual)  
**B) Empezar por 1-2 animaciones específicas**  
**C) Instalar GSAP + ir línea por línea**

Déjame saber y continuamos! 🎬
