# ¿Qué Animaciones Debería Ver? - Guía Visual

**Abierto**: http://localhost:4328  
**Lee esto mientras scrolleas la página** ↓

---

## 📍 SECCIÓN 1: HERO (Top de la página)

### **Animación A: Page Load Fade-In**

**Cuando**: Al cargar la página (primeros 0.8 segundos)

**Qué ves**:
```
ANTES:                      DURANTE (0-0.8s):           DESPUÉS:
Nada                        Aparece suavemente          Completamente visible
(invisible)                 con fade-in                 y en tamaño normal

Círculos y estrella         "Bajan" desde                Se quedan en su lugar
están pequeños              arriba mientras               tamaño final
(scale 0.95)               aparecen
```

**Detalles técnicos**:
- H1 "La adolescencia sin mitos..." → fade-in + crece
- Párrafo y botones → fade-in + crece
- Círculos turquesa → fade-in + crece (comienzan 0.2s después)
- Estrella → fade-in + crece (comienzan 0.2s después)

**Visual esperado**:
```
0.0s ← H1 + párrafo comienzan a aparecer
0.2s ← Círculos + estrella comienzan a aparecer
0.8s ← Todo completamente visible
```

**✅ PASS si**: Todo aparece suavemente (no de golpe)  
**❌ FAIL si**: Todo aparece de golpe instantáneamente

---

### **Animación B: Button Hover - Ripple Effect**

**Cuando**: Pasas el mouse sobre cualquier botón (ej: "Conoce nuestros proyectos")

**Qué ves**:
```
MOUSE ENTERS BUTTON:         ANIMACION (0-0.6s):        DESPUES:
Circulo invisible            Circulo blanco translúcido Circulo desaparece
en punto de entrada          crece desde ese punto       (elemento se elimina)

                             Se expande 300px
                             mientras desaparece (fade)
```

**Visual esperado**:
```
mouse ────→ [BUTTON]
              ↓
           /~~~\
          (  ●  ) ← Círculo pequeño blanco
           \~~~/ 
              ↓
           /~~~~~\
          (   ●   )  ← Círculo creciendo
           \~~~~~/ 
              ↓
           /~~~~~~~\
          (    ●    ) ← Casi desaparecido
           \~~~~~~~/ 
              ↓
           (vacío) ← Completamente desvanecido (0.6s)
```

**✅ PASS si**: Ves una onda blanca que crece y desaparece  
**❌ FAIL si**: Nada pasa al hover, o no hay efecto visible

---

## 📍 SECCIÓN 2: SOBRE NOSOTROS

No hay animaciones nuevas aquí (solo reveal de scroll que ya está).

---

## 📍 SECCIÓN 3: MISIÓN (Beige background)

No hay animaciones nuevas.

---

## 📍 SECCIÓN 4: LO QUE NOS GUÍA (Valores - 4 tarjetas)

### **Animación C: Valores Staggered Reveal**

**Cuando**: Scrolleas a esta sección (primeros 0.5 segundos)

**Qué ves**:
```
ANTES:                      DURANTE:                    DESPUÉS:
Tarjeta 1 invisible         Tarjeta 1 aparece           Todas visibles
Tarjeta 2 invisible         (0.0s-0.5s)
Tarjeta 3 invisible
Tarjeta 4 invisible         Tarjeta 2 aparece
                            (0.1s-0.6s)

                            Tarjeta 3 aparece
                            (0.2s-0.7s)

                            Tarjeta 4 aparece
                            (0.3s-0.8s)
```

**Visual esperado**:
```
Timeline visual:
0.0s  │ Tarjeta 1 ▂▂▂▂▂ (fade-in + slideUp)
      │
0.1s  │ Tarjeta 1 ▂▂▂▂▂
      │ Tarjeta 2 ▂▂▂▂▂ ← Comienza con delay
      │
0.2s  │ Tarjeta 1 ▂▂▂▂▂
      │ Tarjeta 2 ▂▂▂▂▂
      │ Tarjeta 3 ▂▂▂▂▂ ← Comienza con delay
      │
0.3s  │ Tarjeta 1 ▂▂▂▂▂
      │ Tarjeta 2 ▂▂▂▂▂
      │ Tarjeta 3 ▂▂▂▂▂
      │ Tarjeta 4 ▂▂▂▂▂ ← Comienza con delay
      │
0.8s  │ Tarjeta 1 ████ (completamente visible)
      │ Tarjeta 2 ████
      │ Tarjeta 3 ████
      │ Tarjeta 4 ████
```

**✅ PASS si**: 
- Ves cascada de entrada (una tras otra)
- No aparecen todas simultáneamente
- Efecto suave (fade-in + subida)

**❌ FAIL si**: 
- Aparecen todas juntas de golpe
- No hay efecto de cascada

---

## 📍 SECCIÓN 5: ¿QUÉ HACEMOS? (4 tarjetas de servicios)

No hay animaciones nuevas aquí (solo reveal de scroll).

---

## 📍 SECCIÓN 6: NUESTRO IMPACTO (Números grandes + iconos)

### **Animación D: Number Counter**

**Cuando**: Scrolleas a esta sección (los números comienzan a contar)

**Qué ves**:
```
ANTES:              DURANTE (0-2s):         DESPUÉS:
40+                 1+                      40+
(valor final)       2+                      (detiene en final)
                    5+
2,500+              10+
(valor final)       ...
                    35+
15+                 40+ ← Se detiene aquí
(valor final)       
                    (Simultáneamente otros números cuentan)
50+
(valor final)       2,500+ ← Cuenta desde 0
```

**Visual más claro**:
```
0.0s:    0+          0+          0+          0+
0.5s:    20+         1,250+      7+          25+
1.0s:    40+         2,500+      15+         50+ ← Todos llegan al final
1.5s:    40+         2,500+      15+         50+
2.0s:    40+         2,500+      15+         50+ ← SE DETIENE AÍ
```

**✅ PASS si**: 
- Ves números contando de 0 → valor final
- Duran ~2 segundos
- Cada número cuenta de forma independiente
- Tienen el "+" al final

**❌ FAIL si**: 
- Los números aparecen de golpe
- No cuentan, solo aparecen en el valor final

---

## 📍 SECCIÓN 7: PRÓXIMOS EVENTOS (Tarjetas vacías)

No hay contenido, pero si hubiera:
- Sería reveal de scroll normal

---

## 📍 SECCIÓN 8: NUESTRAS PUBLICACIONES (3 artículos)

### **Animación F: Artículos Parallax (Scroll-Linked)**

**Cuando**: Scrolleas hacia arriba/abajo en esta sección

**Qué ves**:
```
ANTES (top):        MIENTRAS SCROLLEAS:      DESPUÉS (bottom):
Artículos alineados Artículos se mueven      Artículos más abajo
en su posición      hacia ABAJO lentamente  en la pantalla

                    (El movimiento está
                     vinculado a tu scroll)
```

**Visual esperado**:
```
Tu scroll ↓        
           ↓ articulo 1 baja lentamente ↓
           ↓ articulo 2 baja lentamente ↓
           ↓ articulo 3 baja lentamente ↓

Efecto: Sensación de "profundidad" (parallax)
```

**Cómo testear**:
1. Scrollea LENTAMENTE arriba/abajo en esta sección
2. Mira si los artículos se mueven en relación al scroll
3. El efecto es SUTIL (no es un movimiento grande)

**✅ PASS si**: 
- Ves movimiento sutil hacia abajo
- El movimiento sigue tu scroll
- Efecto de profundidad

**❌ FAIL si**: 
- No se mueven
- Se mueven bruscamente

---

## 📍 SECCIÓN 9: LO QUE DICEN DE NUESTRO TRABAJO (Testimonios)

### **Animación E: Testimonios Blur Reveal**

**Cuando**: Scrolleas a esta sección

**Qué ves**:
```
ANTES:              DURANTE (0-0.7s):      DESPUÉS:
Testimonios         Aparecen borroneados   Completamente nítidos
invisibles          (blur 10px)

                    Simultáneamente:
                    - Blur desaparece
                    - Fade-in (0 → 1 opacity)
                    - Se mueven un poco hacia arriba
```

**Visual esperado**:
```
0.0s:   [BLURRED CARD 1]
0.1s:   [BLURRED CARD 1] [BLURRED CARD 2]
0.2s:   [BLURRED CARD 1] [BLURRED CARD 2] [BLURRED CARD 3]
0.3s:   [SHARP CARD 1]   [BLURRED CARD 2] [BLURRED CARD 3]
0.5s:   [SHARP CARD 1]   [SHARP CARD 2]   [BLURRED CARD 3]
0.7s:   [SHARP CARD 1]   [SHARP CARD 2]   [SHARP CARD 3]
```

**✅ PASS si**: 
- Ves tarjetas borroneadas que se hacen nítidas
- Efecto suave (no de golpe)
- Aparecen una tras otra (staggered)

**❌ FAIL si**: 
- Aparecen nítidas directamente
- No hay blur al inicio

---

## 📍 SECCIÓN 10: ¿QUIERES SER PARTE DEL CAMBIO? (CTA Final)

No hay animaciones nuevas (botones ya tienen ripple).

---

## 📍 FOOTER

No hay animaciones nuevas.

---

## 🎯 ANIMACIONES "SILENCIOSAS" (Siempre activas)

### **Animación G: Custom Cursor**

**Cuando**: En cualquier parte de la página

**Qué ves**:
```
MOVIMIENTO NORMAL:    CON CURSOR CUSTOM:
● cursor normal       ● pequeño punto turquesa
                      ◯ círculo translúcido grande (que sigue al pequeño)

El círculo grande sigue al pequeño con "lag" suave (no los sigue instantáneamente)
```

**Visual esperado**:
```
Mueve el mouse:

            ◯
           ●   ← Pequeño punto turquesa
           
El círculo grande (◯) sigue al pequeño (●) con retraso suave
```

**✅ PASS si**: 
- Ves 2 círculos (no el cursor normal)
- El grande sigue al pequeño con suavidad

**❌ FAIL si**: 
- Ves el cursor normal (no cambió)
- O solo ves uno de los dos

---

## 📊 RESUMEN: Qué Ver por Sección

| Sección | Animaciones | Ver qué |
|---------|-------------|---------|
| **Hero (Top)** | Page Load + Ripple | Fade-in suave al cargar + círculo en hover |
| **Valores** | Stagger Reveal | Cards aparecen una por una (cascada) |
| **Impacto** | Number Counter | Números cuentan de 0 → valor final |
| **Artículos** | Parallax | Se mueven lentamente con scroll |
| **Testimonios** | Blur Reveal | Aparecen borroneados → nítidos |
| **Cursor** | Always on | 2 círculos siguiendo tu mouse |

---

## ⏱️ CRONOGRAMA MIENTRAS SCROLLEAS

```
PAGE LOAD (0-1s)
├─ Hero fade-in ✅
│
SCROLL BAJANDO
├─ Valores stagger (al llegar a esa sección)
├─ Impacto numbers (al llegar)
├─ Testimonios blur (al llegar)
├─ Artículos parallax (mientras scrolleas)
│
INTERACCIÓN
├─ Hover botón → Ripple effect
├─ Mueve mouse → Custom cursor
│
CONTINUAMENTE
└─ Scroll-linked animations se ejecutan
```

---

## 🎬 TEST RÁPIDO (1 minuto)

1. **Abre http://localhost:4328**
2. **Observa los primeros 1 segundo** → ¿Fade-in en hero? ✅ / ❌
3. **Hover botón** → ¿Ripple? ✅ / ❌
4. **Scroll a valores** → ¿Cascada? ✅ / ❌
5. **Scroll a impacto** → ¿Números cuentan? ✅ / ❌
6. **Mueve mouse** → ¿Cursor custom? ✅ / ❌

**Si 4-5 de 5 ✅ = Animaciones funcionando bien** 🎉

---

**¿Ves lo que describí arriba? Cuéntame qué SÍ ves y qué NO ves** ✅
