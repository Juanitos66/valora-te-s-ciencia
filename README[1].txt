# VALÓRATE CON S-CIENCIA 4.0

## Qué es
Sistema educativo de prevención, autocuidado y toma de decisiones basado en evidencia.

La versión 4.0 conserva el modo demostración/local de las versiones anteriores y añade una arquitectura preparada para datos centrales:

**Estudiante → código anónimo → Radar ISAC → Pre/Post → base central → panel docente → indicadores agregados**

## Lo nuevo en 4.0
- 36 reactivos ISAC educativos.
- Seis dimensiones: Ser consciente, Cuidarme, Identificar riesgos, Elegir, Necesito apoyo y Alcanzar mi futuro.
- Cálculo de puntaje educativo 0–100 y resultados por dimensión.
- Pretest/Postest.
- Registro local automático.
- Exportación CSV.
- Sincronización opcional con Supabase.
- Hash del código anónimo antes de almacenarlo en la base.
- Panel docente autenticado.
- Indicadores agregados: participantes, promedio pre, promedio post y cambio relativo.
- Casos interactivos de toma de decisiones.
- Catálogo de fuentes oficiales INEGI.
- Modo jurado.
- Avisos de privacidad y límites científicos.
- PWA/Service Worker para facilitar uso en dispositivos.

## IMPORTANTE SOBRE LOS DATOS
La versión 4.0 está preparada para recoger datos reales, pero no debe comenzar una recolección institucional real hasta contar con:
1. autorización del plantel/institución;
2. consentimiento/asentimiento cuando corresponda;
3. revisión de protección de datos;
4. protocolo de atención y canalización;
5. validación del instrumento;
6. pilotaje.

El sistema NO diagnostica depresión, adicciones, obesidad, riesgo suicida ni enfermedades.

## Modo local
Sin configurar nada, `index.html` funciona y guarda los resultados en el navegador del dispositivo.

## Activar base central con Supabase
1. Crea un proyecto en Supabase.
2. Abre SQL Editor.
3. Copia y ejecuta todo `schema.sql`.
4. En Authentication crea la cuenta institucional del docente.
5. Abre `config.js`.
6. Sustituye:
   - `PEGA_AQUI_TU_URL_DE_SUPABASE`
   - `PEGA_AQUI_TU_CLAVE_ANON_PUBLICA`
7. No uses `service_role`.
8. Sube `index.html`, `config.js`, `manifest.json`, `sw.js` e `icon.svg` a GitHub Pages.
9. Entra a Impacto → Panel docente e inicia sesión.
10. Prueba primero con códigos y datos ficticios.

## Recomendación para investigación
Mantener separados:
A) datos de contexto oficial (INEGI y otras fuentes);
B) resultados educativos anónimos del estudiante.

No convertir estadísticas poblacionales de México/Tlaxcala en un "riesgo individual".

## Fuentes oficiales de referencia
- INEGI MOCIBA 2024: https://www.inegi.org.mx/programas/mociba/2024/
- INEGI Estadísticas de Defunciones Registradas: https://www.inegi.org.mx/programas/edr/
- INEGI BIARE: https://www.inegi.org.mx/programas/biare/
- INEGI ENBIARE 2021: https://www.inegi.org.mx/programas/enbiare/2021/

## Publicación
El archivo principal debe permanecer como:
`index.html`

Para GitHub Pages:
Settings → Pages → Deploy from branch → main → /(root)

## Defensa ante jurado
La idea central:
> "Los datos nos muestran lo que pasa; la ciencia nos ayuda a comprenderlo; valorarnos nos permite decidir qué hacer."

La innovación no es solamente tener una página web. Es convertir evidencia pública en una experiencia educativa que lleva al estudiante de:
**dato → reflexión → decisión → acción → evaluación**.

## Próxima evolución recomendada
- Validación formal del ISAC.
- Piloto con muestra definida.
- Pruebas de confiabilidad.
- Pretest/Postest con diseño metodológico aprobado.
- Análisis por dimensiones.
- Tamaño de efecto.
- Panel docente con filtros por periodo/grupo.
- Política formal de retención y eliminación de datos.
