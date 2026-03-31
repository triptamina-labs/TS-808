# Herramientas y calidad

## Entorno

- **Node.js**: versión LTS recomendada.
- **pnpm**: gestor de paquetes (`pnpm install`, `pnpm dev`, etc.).

## Scripts (`package.json`)

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo Vite (puerto **3000**, `host: true`). |
| `pnpm build` | `tsc -b` y empaquetado de producción. |
| `pnpm preview` | Sirve la carpeta `dist/` generada. |
| `pnpm lint` | ESLint sobre el proyecto. |
| `pnpm test` | Vitest en modo run, entorno **jsdom**. |
| `pnpm test:watch` | Vitest en modo observación. |

## TypeScript

- Proyecto en referencias: `tsconfig.json` apunta a `tsconfig.app.json` (aplicación) y `tsconfig.node.json` (config de Vite).
- Opciones relevantes en la app: **`strict`**, `noUnusedLocals`, `noUnusedParameters`, `moduleResolution: "Bundler"`, JSX **react-jsx**.

## Vite

- Plugins: **@vitejs/plugin-react**, **@tailwindcss/vite**.
- Entrada: `index.html` en la raíz del paquete `TS-808/`.
- Salida de producción: **`TS-808/dist/`**.

## Pruebas

- **Vitest** con **@testing-library/react** y **jsdom**.
- Ejemplos: `App.test.tsx`, `stateMigration.test.ts`, `reducers.test.ts`, `selectors.test.ts`, pruebas de componentes puntuales.

## Linting

- **ESLint** con configuración plana (`@eslint/js`, `typescript-eslint`, plugins de React Hooks y React Refresh). Ejecutar `pnpm lint` antes de integrar cambios sustanciales.

## Variables de entorno

Prefijo **`VITE_`** para exposición al cliente. Detalle en `.env.example` y en el README principal.
