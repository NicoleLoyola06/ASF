# Guía de Verificación de Animaciones

**Fecha**: 14 agosto 2026  
**Dev Server**: http://localhost:PUERTO (verificar en terminal)  
**Navegador**: Chrome, Firefox o Safari (recomendado Chrome)

---

## 🚀 Paso 1: Verificar que el servidor está corriendo

En la terminal, deberías ver:
```
 astro  v5.X.X ready in XXXms
┃ Local    http://localhost:4XXX/
```

**Copia el URL** y abre en navegador.

---

## 🎯 Paso 2: Test de Animaciones (Checklist)

### **A) PAGE LOAD (Hero)**
**Qué debería ver**: Al cargar la página, el hero (título + párrafo + botones) aparece suavemente con fade-in.

**Cómo testear**:
1. Abre el sitio en pestaña nueva
2. **Observa los primeros 0.8 segundos**
3. ¿Ves que aparece suave, o aparece de golpe?

**Resultado esperado**:
```
✅ Fade-in suave + escala (0.95 → 1)
✅ El visual (círculos + estrella) aparece 0.2s después
❌ Si aparece de golpe = problema en import
```

**Status**: [ ] PASS / [ ] FAIL

---

### **B) BOTONES - Ripple Effect**
**Qué debería ver**: Al pasar el mouse sobre un botón, aparece un círculo que crece y desaparece.

**Cómo testear**:
1. Scroll a sección de hero
2. **Hover sobre "Conoce nuestros proyectos"**
3. ¿Ves una onda (círculo) que crece desde el punto del mouse?

**Resultado esperado**:
```
✅ Círculo blanco translúcido crece 300px
✅ Dura 0.6 segundos
✅ Se desvanece mientras crece
❌ Si no hay efecto = ripple() no se ejecutó
```

**Status**: [ ] PASS / [ ] FAIL

---

### **C) VALORES - Staggered Reveal**
**Qué debería ver**: Cada tarjeta de valor (Evidencia, Compromiso, etc) aparece una por una, no todas simultáneamente.

**Cómo testear**:
1. Scroll a sección "Lo que nos guía" (valores)
2. **Observa las 4 tarjetas de abajo hacia arriba**
3. ¿Aparecen con delay entre ellas (cascada)?

**Resultado esperado**:
```
Tarjeta 1 (Evidencia): 0.0s - 0.5s
Tarjeta 2 (Compromiso): 0.1s - 0.6s
Tarjeta 3 (Educación): 0.2s - 0.7s
Tarjeta 4 (Acción): 0.3s - 0.8s

✅ Cascada suave (ola de entrada)
❌ Si aparecen todas juntas = stagger no funciona
```

**Status**: [ ] PASS / [ ] FAIL

---

### **D) IMPACTO - Number Counter**
**Qué debería ver**: Los números (40+, 2,500+, etc) cuentan desde 0 hasta el valor final.

**Cómo testear**:
1. Scroll a sección "Nuestro impacto"
2. **Mira los números grandes mientras scrolleas hacia arriba**
3. ¿Ves que cuentan 0 → 1 → 2 ... → 40?

**Resultado esperado**:
```
✅ "40+" anima de 0 → 40
✅ "2,500+" anima de 0 → 2,500
✅ Duran 2 segundos en total
✅ Se staggerean (una tras otra, no simultáneas)
❌ Si los números aparecen de golpe = counter no funciona
```

**Status**: [ ] PASS / [ ] FAIL

---

### **E) TESTIMONIOS - Blur Reveal**
**Qué debería ver**: Cada testimonio aparece desborroneado (blur) y se hace nítido.

**Cómo testear**:
1. Scroll a "Lo que dicen de nuestro trabajo"
2. **Observe las 3 tarjetas de testimonios**
3. ¿Se ven un poco borroneadas al aparecer, luego se hacen nítidas?

**Resultado esperado**:
```
✅ Blur 10px → 0px suave
✅ Fade-in simultáneo (0 → 1 opacity)
✅ Staggered: cada una con 0.15s de delay
❌ Si no hay blur = blur reveal no funciona
```

**Status**: [ ] PASS / [ ] FAIL

---

### **F) ARTÍCULOS - Parallax Scroll**
**Qué debería ver**: Mientras scrolleas, los artículos se mueven hacia abajo lentamente (parallax).

**Cómo testear**:
1. Scroll a "Nuestras publicaciones más recientes"
2. **Scroll hacia arriba/abajo lentamente**
3. ¿Se mueven los artículos ligeramente hacia abajo mientras scrolleas?

**Resultado esperado**:
```
✅ Parallax suave (bajan 100px total)
✅ Se mueven mientras scrolleas
✅ Efecto de "profundidad"
❌ Si no se mueven = parallax no funciona
```

**Status**: [ ] PASS / / FAIL

---

### **G) HEADER LINES - Section Headers**
**Qué debería ver**: Debajo de cada título de sección aparece una línea que se "dibuja" de izq → derecha.

**Cómo testear**:
1. Scroll a diferentes secciones
2. Busca líneas SVG debajo de títulos (si están ahí)
3. ¿Se dibujan suavemente o aparecen de golpe?

**Resultado esperado**:
```
✅ Línea se dibuja de izquierda a derecha (0.6s)
✅ Se anima al scrollear a esa sección
✅ Solo una vez (no se repite)
⚠️ Nota: Las líneas necesitan estar en HTML (ver abajo)
```

**Status**: [ ] PASS / [ ] FAIL / [ ] N/A (no hay líneas en HTML)

---

### **H) CURSOR CUSTOMIZADO**
**Qué debería ver**: El cursor del mouse se convierte en un círculo turquesa pequeño + círculo grande translúcido que lo sigue.

**Cómo testear**:
1. **Mueve el mouse por la página**
2. ¿Ves dos círculos? (uno pequeño, uno grande translúcido)
3. ¿El grande sigue al pequeño con lag (suave)?

**Resultado esperado**:
```
✅ Cursor dot pequeño (8px) en color turquesa
✅ Cursor follower (40px) translúcido que sigue
✅ Lag suave (0.6s de transición)
❌ Si no cambió nada = cursor custom no funciona
```

**Nota**: Si ves el cursor normal, puede ser que la función aún no se ejecutó.

**Status**: [ ] PASS / [ ] FAIL

---

## 📊 Resumen de Resultados

| Animación | Status | Notas |
|-----------|--------|-------|
| A) Page Load | ☐ ☐ | |
| B) Button Ripple | ☐ ☐ | |
| C) Valores Stagger | ☐ ☐ | |
| D) Number Counter | ☐ ☐ | |
| E) Testimonios Blur | ☐ ☐ | |
| F) Artículos Parallax | ☐ ☐ | |
| G) Header Lines | ☐ ☐ | |
| H) Custom Cursor | ☐ ☐ | |

**Total PASS**: __ / 8

---

## 🔧 Troubleshooting

### Si NINGUNA animación funciona:
1. Abre **DevTools** (F12)
2. Abre pestaña **Console**
3. ¿Hay errores rojos?
4. Si hay error sobre `gsap` → GSAP no importó bien
5. Si hay error sobre `animations.ts` → Problema en import

### Si algunas funcionan y otras no:
1. Cada función puede fallar independientemente
2. Mira la Console para ver qué falló
3. Reporta el error específico

### Performance:
1. ¿Las animaciones son suaves o laggy?
2. Abre **DevTools → Performance**
3. Haz un recording mientras scrolleas
4. ¿Ves FPS altos (60) o bajos (<30)?

---

## 📋 Reporte al Desarrollador

Cuando reportes, incluye:

```markdown
## Resultados de Test - Animaciones GSAP

**Servidor**: http://localhost:4327
**Navegador**: Chrome/Firefox/Safari
**Fecha**: [Fecha]

### Status
- [ ] A) Page Load: PASS/FAIL
- [ ] B) Button Ripple: PASS/FAIL
- [ ] C) Valores Stagger: PASS/FAIL
- [ ] D) Number Counter: PASS/FAIL
- [ ] E) Testimonios Blur: PASS/FAIL
- [ ] F) Artículos Parallax: PASS/FAIL
- [ ] G) Header Lines: PASS/FAIL
- [ ] H) Custom Cursor: PASS/FAIL

### Problemas encontrados
[Describe qué no funcionó]

### Errores en Console
[Copia/pega errores que veas]

### Observaciones
[Cualquier cosa que notaste]
```

---

## ✅ Validación Final

Si 6+ animaciones funcionan:
```
🎉 SUCCESS - Animaciones implementadas correctamente
Próximo paso: Ajustes finos + Notion integration
```

Si 3-5 funcionan:
```
⚠️ PARTIAL - Algunas animaciones funcionan
Próximo paso: Debug de las que no funcionan
```

Si <3 funcionan:
```
❌ ISSUE - Problema con setup de GSAP
Próximo paso: Revisar imports + configuration
```

---

**¿Listo para testear? Abre el navegador y comienza con la checklist arriba** 🚀
