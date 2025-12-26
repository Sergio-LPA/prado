# Display de Tasas de Cambio para YouDeck

Este proyecto es una página web simple y elegante diseñada para mostrar tasas de cambio desde una hoja de cálculo de Google Sheets en una pantalla de señalización digital (YouDeck).

## Características
- **Actualización Automática**: Se actualiza automáticamente cada 5 minutos.
- **Diseño Responsivo**: Se adapta a diferentes tamaños de pantalla.
- **Modo Oscuro**: Optimizado para pantallas con alto contraste y bajo consumo.
- **Datos en Tiempo Real**: Consume directamente el CSV publicado de Google Sheets.

## Instrucciones de Uso

### Opción 1: Ejecutar Localmente
Simplemente abre el archivo `index.html` en tu navegador web.

### Opción 2: Yodeck (Señalización Digital)
1. Sube estos archivos a un servidor web (o usa GitHub Pages / Vercel / Netlify).
2. En Yodeck, añade un nuevo widget "Web Page".
3. Ingresa la URL donde alojaste el proyecto.
4. Ajusta el zoom si es necesario.

## Personalización
- Para cambiar la URL de la hoja de cálculo, edita la constante `SHEET_URL` en `script.js`.
- Para añadir más banderas, edita el objeto `FLAG_MAP` en `script.js`.
