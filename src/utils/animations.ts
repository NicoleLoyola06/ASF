/**
 * Sistema de animaciones ASF
 *
 * Referencias de marca (Brand/Refrencias de animaciones):
 *  - squiggle.sydney       -> línea que se dibuja sola y sigue bajando con el
 *                             scroll, y scroll suave (Lenis)
 *  - reformcollective.com  -> cortina de apertura de página
 *  - untold.site           -> títulos que se escriben, cursor con lag, línea
 *                             bajo cada título, cadena de círculos que se
 *                             despliega desde el centro
 *  - giannantoniodemalde   -> desplazamiento vertical entre artículos
 *  - vwlab.io              -> conteo numérico en la sección de impacto
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

/* ------------------------------------------------------------------ */
/* 0. Scroll suave  (squiggle.sydney usa Lenis)                        */
/* ------------------------------------------------------------------ */

/**
 * Lenis interpola la posición de scroll en vez de saltar al valor que
 * reporta la rueda. Hay que atarlo a ScrollTrigger a mano: si cada uno
 * corre en su propio ciclo, las animaciones con scrub van un frame atrás
 * y se ven temblorosas.
 *
 * `lagSmoothing(0)` evita que GSAP "recupere" tiempo tras un frame lento,
 * que con scroll atado a scrub produce un salto visible.
 */
function initSmoothScroll(): Lenis | null {
  if (reduceMotion) return null;

  const lenis = new Lenis({
    duration: 1.15,
    // easing exponencial: arranca rápido y frena largo, como la referencia
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Los anclas internas tienen que pasar por Lenis o el salto es seco
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -90 });
    });
  });

  return lenis;
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

function splitIntoMaskedWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'true') {
    return Array.from(el.querySelectorAll<HTMLElement>('.word'));
  }

  const words = (el.textContent || '').trim().split(/\s+/);
  el.textContent = '';

  const wordEls: HTMLElement[] = [];

  words.forEach((word, i) => {
    const mask = document.createElement('span');
    mask.className = 'mask';

    const inner = document.createElement('span');
    inner.className = 'word';
    inner.textContent = word;

    mask.appendChild(inner);
    el.appendChild(mask);

    if (i < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }

    wordEls.push(inner);
  });

  el.dataset.split = 'true';
  return wordEls;
}

/** Extrae el número de un texto tipo "2,500+" -> { value: 2500, suffix: "+" } */
function parseCounterValue(text: string) {
  const digits = text.replace(/[^\d]/g, '');
  const value = parseInt(digits, 10) || 0;
  const suffix = text.trim().endsWith('+') ? '+' : '';
  return { value, suffix };
}

/* ------------------------------------------------------------------ */
/* 1. Cortina de apertura de página  (reformcollective.com)             */
/* ------------------------------------------------------------------ */

function isFirstVisit(): boolean {
  try {
    if (sessionStorage.getItem('asf:opened')) return false;
    sessionStorage.setItem('asf:opened', '1');
    return true;
  } catch {
    return false;
  }
}

function pageOpen(): gsap.core.Timeline {
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';

  const mark = document.createElement('span');
  mark.className = 'page-curtain__mark';

  const img = document.createElement('img');
  img.src = '/images/brand/sol.png';
  img.alt = '';
  mark.appendChild(img);
  curtain.appendChild(mark);

  document.body.appendChild(curtain);

  const tl = gsap.timeline();

  tl.to(mark, { scale: 1, opacity: 1, rotate: 90, duration: 0.55, ease: 'power2.out' })
    .to(mark, { scale: 0.2, opacity: 0, rotate: 180, duration: 0.3, ease: 'power2.in' }, '+=0.1')
    .to(curtain, {
      yPercent: -100,
      duration: 0.8,
      ease: 'expo.inOut',
      onComplete: () => curtain.remove(),
    }, '-=0.1');

  return tl;
}

/* ------------------------------------------------------------------ */
/* 2. Línea squiggle que se dibuja  (squiggle.sydney)                   */
/* ------------------------------------------------------------------ */

/**
 * `stroke-dasharray = longitud` + `stroke-dashoffset = longitud` deja el
 * trazo completamente oculto; llevar el offset a 0 lo dibuja de punta a
 * punta. Es la misma técnica que usa squiggle.sydney (ahí se ve como
 * dasharray "0px, 999999px" en reposo).
 *
 * El tramo del hero se dibuja solo al abrir. Los siguientes van atados al
 * scroll, así la línea "sigue bajando" mientras el visitante avanza.
 */
function drawSquiggles() {
  const svgs = document.querySelectorAll<SVGSVGElement>('[data-squiggle]');

  svgs.forEach((svg) => {
    const path = svg.querySelector('path');
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    if (svg.dataset.squiggle === 'load') {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.6,
        ease: 'power1.inOut',
        delay: 0.35,
      });
      return;
    }

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: svg.closest('section') || svg,
        start: 'top 90%',
        end: 'bottom 45%',
        scrub: 0.9,
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 3. Títulos que se escriben  (untold.site)                            */
/* ------------------------------------------------------------------ */

/**
 * Escritura carácter por carácter con cursor, para los títulos grandes.
 *
 * Dos cuidados que no son opcionales:
 *  - Se reserva la altura antes de vaciar el texto. Si no, el bloque
 *    colapsa a 0 y toda la página salta hacia arriba al empezar a escribir.
 *  - El título conserva su texto completo en aria-label, porque mientras
 *    se escribe el contenido real está incompleto y un lector de pantalla
 *    anunciaría "La adol..." en vez del titular.
 */
function typewriter(el: HTMLElement, delay = 0) {
  const full = (el.textContent || '').trim();
  if (!full) return null;

  el.setAttribute('aria-label', full);
  el.style.minHeight = `${el.offsetHeight}px`;
  el.textContent = '';
  el.classList.add('is-typing');

  const state = { i: 0 };

  return gsap.to(state, {
    i: full.length,
    duration: Math.min(2.8, Math.max(0.9, full.length * 0.042)),
    ease: 'none',
    delay,
    onUpdate: () => {
      el.textContent = full.slice(0, Math.round(state.i));
    },
    onComplete: () => {
      el.textContent = full;
      el.classList.remove('is-typing');
      el.style.minHeight = '';
      ScrollTrigger.refresh();
    },
  });
}

/** Prepara el estado inicial: cada palabra oculta bajo su máscara. */
function prepareHeading(el: HTMLElement) {
  const words = splitIntoMaskedWords(el);
  gsap.set(words, { yPercent: 110 });
  return words;
}

function revealHeading(el: HTMLElement, delay = 0) {
  const words = Array.from(el.querySelectorAll<HTMLElement>('.word'));
  return gsap.to(words, {
    yPercent: 0,
    duration: 0.9,
    ease: 'expo.out',
    stagger: 0.06,
    delay,
  });
}

/* ------------------------------------------------------------------ */
/* 4. Línea que se traza bajo cada título  (untold.site)                */
/* ------------------------------------------------------------------ */

function drawSectionLines() {
  const heads = document.querySelectorAll<HTMLElement>('.section-head');

  heads.forEach((head) => {
    if (head.querySelector('.section-rule')) return;

    const rule = document.createElement('span');
    rule.className = 'section-rule';
    const heading = head.querySelector('h2');
    if (!heading) return;
    heading.insertAdjacentElement('afterend', rule);

    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

    gsap.to(rule, {
      scaleX: 1,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: head, start: 'top 82%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 5. Escritura progresiva en textos secundarios  (untold.site)         */
/* ------------------------------------------------------------------ */

function revealSecondaryText() {
  const targets = document.querySelectorAll<HTMLElement>('.section-head p, [data-type]');

  targets.forEach((el) => {
    const words = splitIntoMaskedWords(el);
    gsap.set(words, { yPercent: 105, opacity: 0 });

    gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.018,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 6. Entrada escalonada de bloques                                     */
/* ------------------------------------------------------------------ */

function staggerBlocks(selector: string, triggerSelector?: string) {
  const items = document.querySelectorAll<HTMLElement>(selector);
  if (!items.length) return;

  gsap.set(items, { y: 40, opacity: 0 });

  gsap.to(items, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.09,
    scrollTrigger: {
      trigger: triggerSelector || (items[0].parentElement as HTMLElement),
      start: 'top 82%',
      once: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* 7. Contador de impacto  (vwlab.io)                                   */
/* ------------------------------------------------------------------ */

function impactCounters() {
  const counters = document.querySelectorAll<HTMLElement>('.impacto-card__value');
  if (!counters.length) return;

  counters.forEach((counter) => {
    const { value, suffix } = parseCounterValue(counter.textContent || '');
    const obj = { n: 0 };

    counter.textContent = '0' + suffix;

    gsap.to(obj, {
      n: value,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: counter, start: 'top 88%', once: true },
      onUpdate: () => {
        counter.textContent = Math.round(obj.n).toLocaleString('es-PE') + suffix;
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 8. Cadena de círculos de valores  (untold.site)                      */
/* ------------------------------------------------------------------ */

/**
 * En untold.site los seis logos arrancan apilados en el centro y se abren
 * en cadena al hacer scroll (lo verifiqué midiendo: pasan de x≈750 los seis
 * a x=157/352/535/...). Acá hacen lo mismo los cuatro valores de ASF.
 *
 * Las posiciones se calculan con función en vez de valores fijos, y con
 * `invalidateOnRefresh` se recalculan al cambiar el ancho: si se cachean,
 * al rotar el teléfono los círculos quedan desalineados.
 */
function valueCircles() {
  const wrap = document.querySelector<HTMLElement>('.valores-cadena');
  if (!wrap) return;

  const items = gsap.utils.toArray<HTMLElement>('.valor-circulo', wrap);
  if (!items.length) return;

  const offsetFor = (el: HTMLElement) => {
    const wr = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    // Se descuenta la x que GSAP ya aplicó, para medir siempre contra la
    // posición de reposo y no acumular offset en cada refresh.
    const applied = Number(gsap.getProperty(el, 'x')) || 0;
    const restCenter = r.left - wr.left + r.width / 2 - applied;
    return wr.width / 2 - restCenter;
  };

  items.forEach((el, i) => {
    gsap.fromTo(
      el,
      { x: () => offsetFor(el), scale: 0.82, opacity: 0.35, rotate: (i - items.length / 2) * 4 },
      {
        x: 0,
        scale: 1,
        opacity: 1,
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 88%',
          end: 'top 35%',
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  // Los círculos punteados de fondo giran lento, como en la referencia
  gsap.to('.valores-cadena__punteado', {
    rotate: 360,
    duration: 90,
    ease: 'none',
    repeat: -1,
  });
}

/* ------------------------------------------------------------------ */
/* 9. Desplazamiento entre artículos  (giannantoniodemalde.com)         */
/* ------------------------------------------------------------------ */

function articlesScrollShift() {
  const cards = document.querySelectorAll<HTMLElement>('.article-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    gsap.to(card, {
      yPercent: -8 * (i % 3),
      ease: 'none',
      scrollTrigger: {
        trigger: card.parentElement as HTMLElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 10. Deriva de la iconografía  (giannantoniodemalde.com)              */
/* ------------------------------------------------------------------ */

function driftBrandMarks() {
  const marks = document.querySelectorAll<HTMLElement>('.brand-mark[data-drift]');

  marks.forEach((mark) => {
    const drift = parseFloat(mark.dataset.drift || '0');
    if (!drift) return;

    const section = mark.closest('section') || (mark.parentElement as HTMLElement);

    gsap.to(mark, {
      yPercent: drift,
      rotate: drift * 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* 11. Cursor con lag  (untold.site)                                    */
/* ------------------------------------------------------------------ */

function customCursor() {
  if (isTouch) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');

  const xDot = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const yDot = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const xRing = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
  const yRing = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });

  window.addEventListener('mousemove', (e) => {
    xDot(e.clientX);
    yDot(e.clientY);
    xRing(e.clientX);
    yRing(e.clientY);
  });

  document.querySelectorAll('a, button, .btn').forEach((el) => {
    el.addEventListener('mouseenter', () =>
      gsap.to(ring, { scale: 1.8, opacity: 0.45, duration: 0.3, ease: 'power2.out' })
    );
    el.addEventListener('mouseleave', () =>
      gsap.to(ring, { scale: 1, opacity: 0.35, duration: 0.3, ease: 'power2.out' })
    );
  });
}

/* ------------------------------------------------------------------ */
/* Inicialización                                                       */
/* ------------------------------------------------------------------ */

export function initAllAnimations() {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));

  if (reduceMotion) {
    document.documentElement.classList.add('anim-ready');
    return;
  }

  initSmoothScroll();

  const typedHeadings = document.querySelectorAll<HTMLElement>('[data-typewriter]');
  const heroRest = document.querySelectorAll<HTMLElement>(
    '.hero__subtext, .hero .btn-row, .hero__visual, .page-head p'
  );

  // Estados iniciales ANTES de mostrar la página (evita parpadeos)
  if (heroRest.length) gsap.set(heroRest, { y: 24, opacity: 0 });
  document.querySelectorAll<HTMLElement>('.section-head h2').forEach(prepareHeading);

  document.documentElement.classList.add('anim-ready');

  const enterHero = () => {
    typedHeadings.forEach((h) => typewriter(h));
    if (heroRest.length) {
      gsap.to(heroRest, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        delay: 0.5,
      });
    }
  };

  if (isFirstVisit()) {
    pageOpen().add(enterHero, '-=0.35');
  } else {
    enterHero();
  }

  document.querySelectorAll<HTMLElement>('.section-head h2').forEach((h2) => {
    ScrollTrigger.create({
      trigger: h2,
      start: 'top 85%',
      once: true,
      onEnter: () => revealHeading(h2),
    });
  });

  drawSquiggles();
  drawSectionLines();
  revealSecondaryText();
  staggerBlocks('.valor');
  staggerBlocks('.servicio');
  staggerBlocks('.impacto-card');
  staggerBlocks('.testimonio-card');
  staggerBlocks('.paso');
  impactCounters();
  valueCircles();
  articlesScrollShift();
  driftBrandMarks();
  customCursor();

  ScrollTrigger.refresh();
}
