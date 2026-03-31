# TS-808

Aplicación web que reproduce una caja de ritmos inspirada en la **Roland TR-808**: secuenciador, síntesis de sonido en el navegador mediante la Web Audio API e interfaz orientada al diseño del equipo original.

El código fuente se encuentra en **`TS-808/`** (nombre del paquete en `package.json`: `ts-808`).

**Documentación técnica** (arquitectura, Redux, motor de audio, modos y herramientas): carpeta [`docs/`](./docs/README.md).

## Instalación

Requisitos: **Node.js** (se recomienda una versión LTS) y **pnpm** como gestor de paquetes.

```bash
cd TS-808
pnpm install
pnpm dev
```

El servidor de desarrollo (Vite) queda disponible en el **puerto 3000** y escucha en todas las interfaces de red, lo que facilita pruebas desde otros dispositivos en la misma red.

**Comandos habituales:**

- `pnpm build` — compilación para producción (TypeScript y empaquetado con Vite).
- `pnpm preview` — sirve el build generado de forma local antes de desplegar.
- `pnpm lint` — análisis estático con ESLint.
- `pnpm test` / `pnpm test:watch` — ejecución de tests con Vitest.

## Variables de entorno (opcional)

Para ajustar el comportamiento sin modificar el código, copie `.env.example` a `.env` y configure las variables que necesite:

- **`VITE_WEBFONT_BASE_URL`** — URL base desde la que se cargan las fuentes web (Helvetica LT, ITC Serif Gothic). Si se deja vacía, esas fuentes no se inyectan.
- **`VITE_FATHOM_TRACKER_URL`** y **`VITE_FATHOM_SITE_ID`** — integración con [Fathom Analytics](https://usefathom.com/). El seguimiento solo se activa si **ambas** variables están definidas.

## Arquitectura (resumen)

La aplicación es una SPA con **React** y **TypeScript**, construida con **Vite** y estilos con **Tailwind**. El estado global se gestiona con **Redux**; parte del estado se persiste en el navegador (**redux-persist**) e incluye migraciones cuando cambia el esquema almacenado.

El motor de audio utiliza la **Web Audio API**: un reloj (**WAAClock**) sincroniza el tiempo; el componente **`Sequencer`** lee el estado y dispara los sonidos en cada paso. Los instrumentos están organizados en módulos bajo `domain/audio/synth/` (bombo, caja, platos, etc.). La interfaz refleja y modifica ese mismo estado.

En `src/`, la organización aproximada es: **`app/`** (store, providers, configuración); **`domain/`** (estado y audio); **`ui/`** (componentes y layouts); **`shared/`** (utilidades compartidas); **`styles/`** (estilos globales). Los alias definidos en `vite.config.ts` (`app`, `domain`, `store`, `synth`, entre otros) acortan las rutas de importación.

## Despliegue

Tras `pnpm build`, los artefactos se generan en **`TS-808/dist/`** y pueden servirse como sitio estático. El comando `pnpm preview` permite revisar el resultado del build en local.

## Limitaciones y trabajo pendiente

Para cumplir una fecha objetivo de **lanzamiento inicial (8 de agosto)**, varias funciones del TR-808 original **no están implementadas todavía** y quedan aplazadas para versiones posteriores:

- **Modo PLAY** — reproducción según el diseño original del hardware.
- **Modo COMPOSE** — composición según el diseño original.
- **PRE-SCALE** — el interruptor está deshabilitado y la posición mostrada queda **fija en “3”** (no replica aún el comportamiento del hardware).
- **Botón TAP** — añadir disparos o acentos mediante TAP, pendiente de implementar.

El desarrollo continuará centrado en estas funciones y en **refinar la síntesis de cada sonido** para acercarse más al timbre del hardware original.

## Aviso sobre la marca

**TR-808** es una marca comercial de Roland Corporation. Este proyecto es una recreación con fines educativos y no tiene relación oficial con Roland.
