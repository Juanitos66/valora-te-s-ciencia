# VALÓRATE CON S-CIENCIA 5.0

## Qué es
Plataforma educativa de prevención, autocuidado, formación socioemocional y toma de decisiones basada en evidencia. Mantiene el Radar educativo ISAC, el ABC de las emociones, la evaluación Pre/Post y el modo local con sincronización central opcional.

## Novedades de la versión 5.0
- Nuevo espacio personal para estudiantes.
- Registro local de pausas de bienestar y estados de ánimo voluntarios.
- Metas pequeñas con fecha, seguimiento y opción de eliminar.
- Lista de acciones de autocuidado por día.
- Bitácora personal y exportación de datos en JSON.
- Controles de accesibilidad: tamaño de lectura y alto contraste.
- Integración en navegación principal y acceso desde Inicio.
- Actualización de PWA y Service Worker para cargar los nuevos archivos.
- Los datos del espacio personal se mantienen localmente y no se envían a Supabase ni al panel docente.

## Módulos que conserva
- Radar ISAC educativo de 36 reactivos y seis dimensiones.
- Evaluación Pretest/Postest y exportación CSV.
- Panel docente central con indicadores agregados, sujeto a configuración de Supabase.
- ABC de las emociones con mapa emocional, 20 actividades, pausa y regulación, red de apoyo, familia y escuela.
- Casos de toma de decisiones, fuentes oficiales, metodología y modo jurado.

## Privacidad y límites
La sección Mi espacio guarda la información en el navegador del dispositivo. No es una plataforma de atención clínica. El Radar y el resto de los ejercicios no diagnostican trastornos ni enfermedades. No ingreses datos sensibles ni identificadores personales. Si compartes un dispositivo, considera borrar tus datos al terminar.

Antes de recolectar datos institucionales reales se requiere autorización del plantel, revisión de protección de datos, consentimiento/asentimiento cuando corresponda, protocolo de atención y canalización, validación del instrumento y pilotaje.

## Modo local
La aplicación funciona sin configurar Supabase. Los registros de Radar/Pretest quedan en el dispositivo. Mi espacio utiliza una clave de almacenamiento separada y no sincroniza con el panel central.

## Activar base central con Supabase
1. Crea un proyecto en Supabase.
2. Ejecuta `schema.sql` en SQL Editor.
3. Crea la cuenta docente en Authentication.
4. Sustituye en `config.js` la URL del proyecto y la clave pública ANON.
5. Nunca uses `service_role` en el frontend.
6. Publica los archivos del repositorio en GitHub Pages.
7. Prueba con códigos y datos ficticios antes de cualquier aplicación real.

El panel central requiere sesión docente autenticada y devuelve indicadores agregados, no filas individuales. Un código seudónimo y su HMAC no equivalen a anonimato absoluto.

## Publicación
GitHub Pages: Settings → Pages → Deploy from branch → main → /(root). El archivo principal permanece como `index.html`.

## Idea central
“Los datos nos muestran lo que pasa; la ciencia nos ayuda a comprenderlo; valorarnos nos permite decidir qué hacer.”
