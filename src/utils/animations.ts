/**
 * Librería centralizada de animaciones ASF
 * Importa GSAP + ScrollTrigger
 * Cada función exporta una animación específica
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registra ScrollTrigger como plugin de GSAP
gsap.registerPlugin(ScrollTrigger);

// ============================================
// 1. PAGE LOAD ANIMATION (Hero)
// ============================================
/**
 * Anima la entrada del hero cuando carga la página
 * - H1 + párrafo aparecen con fade-in + scale
 * - Visual (círculos + estrella) aparecen 0.2s después
 *
 * Uso:
 * ```
 * import { heroPageLoad } from '@/utils/animations';
 *
 * heroPageLoad();
 * ```
 */
export function heroPageLoad() {
  // Timeline = secuencia ordenada de animaciones
  const tl = gsap.timeline();

  // Primera: fade-in + scale de la copia (h1, p, botones)
  tl.from('.hero__copy', {
    duration: 0.8,
    opacity: 0,
    scale: 0.95,
    ease: 'power2.out'
  });

  // Simultáneamente: fade-in + scale del visual (círculos, estrella)
  // El "-=0.6" significa "comienza 0.6s antes del fin de la animación anterior"
  // (O sea, 0.2s después del inicio)
  tl.from('.hero__visual', {
    duration: 0.8,
    opacity: 0,
    scale: 0.95,
    ease: 'power2.out'
  }, "-=0.6");
}

// ============================================
// 2. SECTION HEADER LINE ANIMATION
// ============================================
/**
 * Dibuja una línea bajo títulos de secciones
 * La línea aparece de izq→der (stroke-dashoffset)
 *
 * Uso:
 * ```
 * import { sectionHeaderLines } from '@/utils/animations';
 *
 * sectionHeaderLines(); // Anima todas las secciones
 * ```
 */
export function sectionHeaderLines() {
  // Selecciona todos los SVG lines que tienen la clase "section-line"
  const lines = document.querySelectorAll('.section-line line');

  lines.forEach((line, index) => {
    // Calcula el largo total de la línea
    const length = (line as SVGLineElement).getTotalLength();

    // Configura el estado inicial
    gsap.set(line, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    // Anima: el dashoffset va de length → 0 (line aparece)
    gsap.to(line, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: index * 0.15, // Cada línea comienza 0.15s después de la anterior
      scrollTrigger: {
        trigger: line.closest('.section-head'), // Se anima cuando esta sección entra en viewport
        start: 'top 80%', // Comienza cuando el top está al 80% del viewport
        once: true // Solo anima una vez
      }
    });
  });
}

// ============================================
// 3. VALORES STAGGERED REVEAL
// ============================================
/**
 * Cada valor aparece con fade-in + slideUp, con delay entre cards
 *
 * Uso:
 * ```
 * import { valoresStagger } from '@/utils/animations';
 *
 * valoresStagger();
 * ```
 */
export function valoresStagger() {
  gsap.from('.valor', {
    duration: 0.5,
    opacity: 0,
    y: 30, // Sube 30px mientras aparece
    ease: 'power2.out',
    stagger: 0.1, // Delay de 0.1s entre cada card
    scrollTrigger: {
      trigger: '.grid.grid-4.valores', // Se anima cuando esta grid entra en viewport
      start: 'top 80%',
      once: true
    }
  });
}

// ============================================
// 4. BUTTON RIPPLE EFFECT (Hover)
// ============================================
/**
 * Crea efecto ripple en botones al hacer hover
 * Necesita CSS @keyframe 'ripple' definida en global.css
 *
 * Uso:
 * ```
 * import { buttonRipple } from '@/utils/animations';
 *
 * buttonRipple();
 * ```
 */
export function buttonRipple() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', (e) => {
      const rect = (btn as HTMLElement).getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;

      // Crea un elemento ripple temporal
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.pointerEvents = 'none';

      (btn as HTMLElement).appendChild(ripple);

      // Anima el ripple
      gsap.to(ripple, {
        width: 300,
        height: 300,
        left: x - 150,
        top: y - 150,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove(); // Elimina el elemento ripple cuando termina
        }
      });
    });
  });
}

// ============================================
// 5. IMPACTO NUMBER COUNTER
// ============================================
/**
 * Anima números contando desde 0 hasta el valor final
 * Trigger: cuando la sección entra en viewport
 *
 * Uso:
 * ```
 * import { impactoCounter } from '@/utils/animations';
 *
 * impactoCounter();
 * ```
 *
 * HTML esperado:
 * ```html
 * <p class="impacto-card__value" data-value="40">40+</p>
 * ```
 */
export function impactoCounter() {
  const counters = document.querySelectorAll('.impacto-card__value');

  counters.forEach((counter, index) => {
    const finalValue = parseInt((counter as HTMLElement).textContent || '0') || 0;
    const displayText = (counter as HTMLElement).textContent;

    gsap.to(counter, {
      duration: 2,
      textContent: finalValue,
      snap: { textContent: 1 }, // Snap a números enteros
      stagger: 0.1,
      ease: 'power1.out',
      delay: index * 0.15,
      scrollTrigger: {
        trigger: '.impacto-grid',
        start: 'top 70%',
        once: true
      },
      // Agrega sufijo (+ o similar) después del número
      onUpdate: function() {
        const current = Math.ceil((counter as any)._gsap.targets[0].textContent);
        (counter as HTMLElement).textContent = current + (displayText?.includes('+') ? '+' : '');
      }
    });
  });
}

// ============================================
// 6. TESTIMONIOS BLUR REVEAL
// ============================================
/**
 * Cada testimonio aparece con blur que desaparece
 *
 * Uso:
 * ```
 * import { testimoniosBlurReveal } from '@/utils/animations';
 *
 * testimoniosBlurReveal();
 * ```
 */
export function testimoniosBlurReveal() {
  gsap.from('.testimonio-card', {
    duration: 0.7,
    opacity: 0,
    filter: 'blur(10px)',
    ease: 'power2.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: '.testimonios-grid',
      start: 'top 80%',
      once: true
    }
  });
}

// ============================================
// 7. ARTICULOS PARALLAX SCROLL
// ============================================
/**
 * Mientras scrolleas, cada artículo se mueve down (parallax)
 * Crea efecto de "profundidad"
 *
 * Uso:
 * ```
 * import { articulosParallax } from '@/utils/animations';
 *
 * articulosParallax();
 * ```
 */
export function articulosParallax() {
  gsap.to('.article-card', {
    y: 100, // Baja 100px
    ease: 'none',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.grid.grid-3:not(.valores)', // Grid de artículos (no el de valores)
      start: 'top center',
      end: 'bottom center',
      scrub: 1 // Sincroniza con scrollbar (1 = smooth follow)
    }
  });
}

// ============================================
// 8. CUSTOM CURSOR TRACKING
// ============================================
/**
 * Cursor se convierte en círculo + trailing dot
 * Sigue el mouse en tiempo real
 *
 * Uso:
 * ```
 * import { customCursor } from '@/utils/animations';
 *
 * customCursor();
 * ```
 *
 * HTML esperado:
 * ```html
 * <div class="cursor"></div>
 * <div class="cursor-follower"></div>
 * ```
 */
export function customCursor() {
  const cursor = document.querySelector('.cursor') as HTMLElement;
  const follower = document.querySelector('.cursor-follower') as HTMLElement;

  if (!cursor || !follower) return;

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot sigue exactamente
    gsap.to(cursor, {
      left: mouseX,
      top: mouseY,
      duration: 0,
      overwrite: 'auto'
    });

    // Follower sigue con lag (suave)
    gsap.to(follower, {
      left: mouseX - 20,
      top: mouseY - 20,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  // Oculta cursor default
  document.body.style.cursor = 'none';
}

// ============================================
// 9. TYPING ANIMATION (para textos)
// ============================================
/**
 * Texto "escribe" letra por letra
 * CSS-based, sin JavaScript overhead
 * Ya está en global.css con @keyframes typing
 *
 * Uso en HTML:
 * ```html
 * <p class="hero__subtext typing-animation">
 *   Tu texto que se escribe...
 * </p>
 * ```
 */
// Esta animación es 100% CSS, ver global.css

// ============================================
// INICIALIZADOR MAESTRO
// ============================================
/**
 * Ejecuta TODAS las animaciones en orden
 * Llama esta función en el componente Layout
 *
 * Uso:
 * ```
 * import { initAllAnimations } from '@/utils/animations';
 *
 * // En un <script> del layout:
 * initAllAnimations();
 * ```
 */
export function initAllAnimations() {
  // Espera a que el DOM esté completamente listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAnimations);
  } else {
    runAnimations();
  }
}

function runAnimations() {
  heroPageLoad();
  sectionHeaderLines();
  valoresStagger();
  buttonRipple();
  impactoCounter();
  testimoniosBlurReveal();
  articulosParallax();
  customCursor();
  // typing es CSS, no requiere JS
}
