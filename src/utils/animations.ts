/**
 * Sistema de animaciones ASF
 *
 * Referencias de marca (Brand/Refrencias de animaciones):
 *  - reformcollective.com  -> cortina de apertura de página
 *  - aidigital.com         -> títulos que suben desde una máscara, palabra por palabra
 *  - untold.site           -> cursor con lag, línea que se traza bajo cada título,
 *                             escritura progresiva en textos secundarios
 *  - giannantoniodemalde   -> desplazamiento vertical entre artículos al hacer scroll
 *  - vwlab.io              -> conteo numérico en la sección de impacto
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

/**
 * Parte el texto de un elemento en palabras, y envuelve cada una en una
 * máscara con overflow hidden. Así la palabra puede "subir" desde abajo
 * sin desbordar (es la técnica de aidigital.com y untold.site).
 *
 * <h1>Hola mundo</h1>
 *   ->
 * <h1><span class="mask"><span class="word">Hola</span></span> <span class="mask">…</span></h1>
 */
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

    // Espacio real entre palabras (fuera de la máscara, para que el wrap funcione)
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

/**
 * La cortina es un saludo de entrada al sitio, no una transición entre páginas.
 * El sitio es multipágina, así que cada navegación es una carga completa y la
 * cortina se repetiría en cada clic. sessionStorage la limita a la primera
 * visita de la pestaña; se reinicia al abrir una pestaña nueva.
 */
function isFirstVisit(): boolean {
  try {
    if (sessionStorage.getItem('asf:opened')) return false;
    sessionStorage.setItem('asf:opened', '1');
    return true;
  } catch {
    // Modo privado o cookies bloqueadas: mejor no repetir la cortina.
    return false;
  }
}

function pageOpen(): gsap.core.Timeline {
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';

  const mark = document.createElement('span');
  mark.className = 'page-curtain__mark';

  // El sol naranja del kit de marca: la apertura ya es ASF, no un punto genérico.
  const img = document.createElement('img');
  img.src = '/images/brand/sol.png';
  img.alt = '';
  mark.appendChild(img);
  curtain.appendChild(mark);

  document.body.appendChild(curtain);

  const tl = gsap.timeline();

  // El sol crece girando, y la cortina sube revelando la página
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
/* 2. Títulos con máscara  (aidigital.com "We are AI digital")           */
/* ------------------------------------------------------------------ */

/** Prepara el estado inicial: cada palabra oculta bajo su máscara. */
function prepareHeading(el: HTMLElement) {
  const words = splitIntoMaskedWords(el);
  gsap.set(words, { yPercent: 110 });
  return words;
}

/** Anima las palabras hacia arriba, una tras otra. */
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
/* 3. Línea que se traza bajo cada título  (untold.site)                */
/* ------------------------------------------------------------------ */

function drawSectionLines() {
  const heads = document.querySelectorAll<HTMLElement>('.section-head');

  heads.forEach((head) => {
    if (head.querySelector('.section-rule')) return;

    const rule = document.createElement('span');
    rule.className = 'section-rule';
    // Se inserta justo después del h2
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
/* 4. Escritura progresiva en textos secundarios  (untold.site)         */
/* ------------------------------------------------------------------ */

function revealSecondaryText() {
  // Los párrafos descriptivos bajo cada título de sección.
  // (El subtítulo del hero se anima aparte, con la cortina de apertura.)
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
/* 5. Entrada escalonada de bloques                                     */
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
/* 6. Contador de impacto  (vwlab.io)                                   */
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
/* 7. Desplazamiento entre artículos  (giannantoniodemalde.com)         */
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
/* 7b. Deriva de la iconografía de marca  (giannantoniodemalde.com)     */
/* ------------------------------------------------------------------ */

/**
 * Las estrellas, rombos y manchas del kit se mueven a distinta velocidad
 * que el texto al hacer scroll. Es lo que da profundidad sin fotos, que es
 * justo la restricción del manual (fotos solo en reseñas, convocatorias
 * y cobertura de eventos).
 *
 * La velocidad de cada marca se declara en el markup con data-drift.
 */
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
/* 7c. Chips de valores dentro del párrafo  (untold.site "brands")      */
/* ------------------------------------------------------------------ */

/**
 * En untold.site los logos de clientes viven dentro de una frase corrida,
 * entre paréntesis. Acá los valores de ASF entran igual: no como tarjetas
 * sueltas sino incrustados en la oración, apareciendo uno por uno.
 */
function revealValueChips() {
  const chips = document.querySelectorAll<HTMLElement>('.valor-chip');
  if (!chips.length) return;

  gsap.set(chips, { scale: 0.6, opacity: 0 });

  gsap.to(chips, {
    scale: 1,
    opacity: 1,
    duration: 0.55,
    ease: 'back.out(1.7)',
    stagger: 0.11,
    scrollTrigger: {
      trigger: chips[0].closest('.valores-frase') || chips[0],
      start: 'top 80%',
      once: true,
    },
  });
}

/* ------------------------------------------------------------------ */
/* 8. Cursor con lag  (untold.site)                                     */
/* ------------------------------------------------------------------ */

function customCursor() {
  if (isTouch) return; // En móvil no hay cursor que reemplazar

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

  // El anillo crece sobre elementos interactivos
  document.querySelectorAll('a, button, .btn').forEach((el) => {
    el.addEventListener('mouseenter', () =>
      gsap.to(ring, { scale: 1.8, opacity: 0.45, duration: 0.3, ease: 'power2.out' })
    );
    el.addEventListener('mouseleave', () =>
      gsap.to(ring, { scale: 1, opacity: 0.25, duration: 0.3, ease: 'power2.out' })
    );
  });
}

/* ------------------------------------------------------------------ */
/* Inicialización                                                       */
/* ------------------------------------------------------------------ */

export function initAllAnimations() {
  // El CSS de [data-reveal] pone opacity:0. GSAP toma el control, así que
  // se neutraliza de inmediato para que no pelee con las animaciones.
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));

  if (reduceMotion) {
    // Sin movimiento: todo visible, sin cortina ni cursor.
    document.documentElement.classList.add('anim-ready');
    return;
  }

  const hero = document.querySelector<HTMLElement>('.hero__copy h1');
  const heroRest = document.querySelectorAll<HTMLElement>(
    '.hero__subtext, .hero .btn-row, .hero__visual'
  );

  // Estados iniciales ANTES de mostrar la página (evita parpadeos)
  if (hero) prepareHeading(hero);
  if (heroRest.length) gsap.set(heroRest, { y: 24, opacity: 0 });

  document.querySelectorAll<HTMLElement>('.section-head h2').forEach(prepareHeading);

  document.documentElement.classList.add('anim-ready');

  // 1. Entrada del hero
  const enterHero = () => {
    if (hero) revealHeading(hero);
    if (heroRest.length) {
      gsap.to(heroRest, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        delay: 0.15,
      });
    }
  };

  if (isFirstVisit()) {
    // Solo al entrar al sitio: cortina, y el hero entra mientras se retira.
    pageOpen().add(enterHero, '-=0.35');
  } else {
    // Navegación interna: el hero entra directo, sin cortina.
    enterHero();
  }

  // 2. Títulos de sección al entrar en pantalla
  document.querySelectorAll<HTMLElement>('.section-head h2').forEach((h2) => {
    ScrollTrigger.create({
      trigger: h2,
      start: 'top 85%',
      once: true,
      onEnter: () => revealHeading(h2),
    });
  });

  // 3. Resto
  drawSectionLines();
  revealSecondaryText();
  staggerBlocks('.valor');
  staggerBlocks('.servicio');
  staggerBlocks('.impacto-card');
  staggerBlocks('.testimonio-card');
  staggerBlocks('.paso');
  impactCounters();
  articlesScrollShift();
  driftBrandMarks();
  revealValueChips();
  customCursor();

  ScrollTrigger.refresh();
}
