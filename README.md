# Cabalango · Presentación turística 2026/27

Base técnica de una presentación web interactiva, institucional y a pantalla completa para el sistema de captación turística de Cabalango, Córdoba. Está construida sin frameworks ni dependencias: utiliza HTML5, CSS3, JavaScript vanilla, JSON y queda lista para alojarse en GitHub Pages.

## Ejecución local

El sitio usa `fetch` para los datos futuros, por lo que conviene servirlo mediante HTTP en lugar de abrir `index.html` directamente:

```bash
python3 -m http.server 8000
```

Luego visitar `http://localhost:8000/`. No hay instalación ni compilación.

## Estructura

```text
.
├── index.html                  # Slides y controles semánticos
├── assets/                     # Imágenes, logos, íconos y mockups
├── css/
│   ├── variables.css          # Paleta y tokens de diseño
│   ├── base.css               # Normalización y componentes base
│   ├── presentation.css       # Slides, layouts, controles y animación
│   └── responsive.css         # Tablet, móvil y movimiento reducido
├── data/turismo-2026.json     # Fuente única de métricas turísticas
├── js/
│   ├── presentation.js        # Navegación, hash, swipe y fullscreen
│   ├── animations.js          # Entrada y preferencias de movimiento
│   ├── charts.js              # Datos y base para gráficos SVG futuros
│   └── tracking.js            # Eventos preparados para futura analítica
└── .github/workflows/pages.yml
```

## Agregar una diapositiva

1. Añadir un `<section class="slide ..." id="slide-N">` dentro de `<main>` en `index.html`.
2. Vincular su título con `aria-labelledby` y marcar inicialmente `aria-hidden="true"`.
3. Usar una de las clases de layout preparadas: `hero-slide`, `data-slide`, `split-slide`, `quote-slide`, `map-slide`, `timeline-slide`, `funnel-slide`, `demo-slide` o `closing-slide`.
4. Aplicar `animate-in` al título, contenido y elementos secundarios en el orden de aparición.
5. Incluir una fuente visible con `<p class="source">Fuente: …</p>` cuando corresponda.

El total, el progreso, el estado accesible y la navegación se calculan automáticamente. Los hashes deben conservar el formato `#slide-N`.

## Editar datos

Las métricas viven en `data/turismo-2026.json`. Para utilizarlas desde una diapositiva:

```js
const datos = await window.CabalangoCharts.loadTourismData();
```

Mantener este archivo como fuente única y no copiar valores en HTML o JavaScript salvo que exista una razón editorial explícita.

## Agregar imágenes

- Fotografías: `assets/images/`
- Marcas: `assets/logos/`
- Íconos SVG: `assets/icons/`
- Capturas y dispositivos: `assets/mockups/`

Usar rutas relativas (por ejemplo, `assets/images/rio.webp`) para funcionar dentro del subdirectorio de GitHub Pages. Indicar siempre `alt`, dimensiones `width`/`height` para evitar saltos de layout y `loading="lazy"` para recursos fuera de la primera slide.

### QR y fotografía de cierre

- La diapositiva 18 intenta cargar `assets/qr/cabalango-presentacion.png`. Ese archivo debe ser un QR generado a partir de `app_url_tracked` en `data/config.json`; si no existe, se muestra un placeholder identificado y el botón **ABRIR APP / WEB** continúa funcionando con la URL configurada.
- Cuando cambie `app_url_tracked`, regenerar el PNG con cualquier generador QR confiable, conservar ese nombre y comprobar el escaneo antes de publicar. No se repite la URL dentro del HTML.
- La diapositiva 19 intenta cargar `assets/images/cierre-cabalango.jpg` como fondo. Si el archivo no está disponible, conserva automáticamente el fondo editorial de la presentación.

## Publicar en GitHub Pages

1. En GitHub, abrir **Settings → Pages**.
2. En **Build and deployment**, seleccionar **GitHub Actions**.
3. Hacer push a la rama `main`.

El workflow `.github/workflows/pages.yml` publica la raíz del repositorio. No utiliza rutas absolutas, por lo que funciona en `https://usuario.github.io/presentacion_cabalango/`.

## Atajos

| Acción | Teclas |
| --- | --- |
| Siguiente | `→`, `PageDown`, `Espacio` |
| Anterior | `←`, `PageUp` |
| Primera | `Home` |
| Última | `End` |
| Pantalla completa | `F` |
| Salir de pantalla completa | `Escape` |
| Móvil | Deslizar horizontalmente |

También se puede navegar mediante los controles visibles. Abrir una URL como `index.html#slide-3` carga directamente esa diapositiva.

## Principios de implementación

- Cada slide ocupa exactamente el viewport; el documento no tiene scroll vertical.
- Los controles son accesibles, el foco es visible y las slides inactivas usan `inert`.
- Las transiciones respetan `prefers-reduced-motion`.
- `tracking.js` expone puntos de integración para GA4 sin enviar datos actualmente.
- Los componentes `.metric`, `.card`, `.badge`, `.callout`, `.flow-step` y `.timeline-item` están preparados para la siguiente etapa.
