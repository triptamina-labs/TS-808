# Arquitectura

## Visión general

TS-808 es una **aplicación de una sola página (SPA)** ejecutada íntegramente en el cliente. No hay backend propio: el estado vive en **Redux** y, en parte, en **localStorage** mediante redux-persist.

La responsabilidad se divide de forma aproximada en:

| Área | Directorio principal | Rol |
|------|----------------------|-----|
| Composición y estado global | `src/app/` | Store Redux, `PersistGate`, contexto de `AudioContext` / WAAClock |
| Dominio (reglas + audio) | `src/domain/` | Reducers, selectores, secuenciador y síntesis |
| Presentación | `src/ui/` | Layouts, componentes de control, tema |
| Compartido | `src/shared/` | Utilidades (p. ej. geometría) |
| Estilos | `src/styles/` | CSS global (Tailwind v4) |

## Arranque

1. **`index.html`** carga el bundle de Vite y un contenedor de carga inicial (`#loader`).
2. **`main.tsx`** monta React en modo estricto, envuelve la app en **`AppProviders`** (Redux + persistencia) e importa estilos globales.
3. **`App.tsx`**:
   - Retira el loader tras el primer layout.
   - Opcionalmente inyecta fuentes web y el script de Fathom según variables `VITE_*`.
   - Renderiza **`KnobOverlayManager`**, el **`Sequencer`** (importación diferida con `React.lazy`) y **`AppLayout`** (interfaz del sintetizador).

El **audio no se inicializa** hasta que el usuario interactúa de forma que llame a `requestInit()` en el contexto de audio (p. ej. al pulsar Start): así se respeta la política de autoplay del navegador.

## Alias de importación

Vite y `tsconfig.app.json` definen alias para evitar rutas relativas largas. Ejemplos:

- `store` → `src/app/store/index.ts`
- `actionCreators` / `actionTypes` / `initialState` / `store-constants`
- `selectors/*`, `reducers/*`, `synth/*`
- `components/*`, `layouts/*`, `audioCtxContext`

La lista completa está en `TS-808/vite.config.ts` (`resolve.alias`) y en `TS-808/tsconfig.app.json` (`paths`).

## Dependencias destacadas

- **React 19** + **react-redux** para la UI y la suscripción al store.
- **redux** + **redux-persist** para estado y persistencia selectiva.
- **immer** (`produce`) en el reducer raíz para actualizaciones inmutables legibles.
- **reselect** para selectores memorizados.
- **react-gui** para primitivas de interfaz acordes al estilo del proyecto.
- **waaclock** para temporización en el tiempo del `AudioContext`.
- **file-saver** en flujos de exportación de estado (véase componentes de guardado).
