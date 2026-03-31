# Estado y Redux

## Store

El store se crea en `src/app/store/index.ts`:

- **Reducer** envuelto con `persistReducer` de redux-persist.
- **Almacenamiento**: `localStorage` vía `createWebStorage("local")`.
- **Clave** y versión: `APP_STORAGE_KEY` (`"TS-808"`) y `STATE_MIGRATION_VERSION` en `stateMigration.ts`.
- **Immer**: `setAutoFreeze(false)` para evitar el coste de congelación en producción con objetos grandes.
- **Redux DevTools**: solo en modo no producción si la extensión está disponible.

## Forma del estado (`RootState`)

Definido en `src/domain/state/types.ts`. Incluye entre otros:

- **`instrumentState`**: controles por instrumento (nivel, tono, decay, etc.).
- **`patternLengths`**: longitud de patrón por pista y parte (`patternLengthKey` en `helpers.ts`).
- **`steps`**: mapa de claves de paso → booleano (paso activo).
- **`currentPart`**, **`currentVariation`**, **`currentPattern`**, **`selectedPattern`**, **`playing`**, **`tempo`**, **`fineTempo`**, **`masterVolume`**.
- **`selectedMode`**: modo de trabajo (constantes en `store-constants.ts`).
- Campos de UI/transporte: **`currentStep`**, **`blinkState`**, arrastre de clear, etc.

Las claves de paso siguen el formato generado por `stepKey(pattern, instrument, part, variation, step)` en `helpers.ts`.

## Acciones

Los tipos viven en `actionTypes.ts` y los creadores en `actionCreators.ts`. Incluyen cambios de instrumento, modo, tempo, pasos, eventos de clear, **`TICK`** / **`BLINK_TICK`** (reloj), **`STATE_LOAD`**, **`RESET`**, etc.

El **reducer raíz** está en `src/domain/state/reducers/index.ts` y delega parte de la lógica en `reducers/clear.ts` y `reducers/stepClick.ts`.

## Persistencia

Solo un subconjunto del estado se guarda en disco. La lista blanca está en `PERSISTANCE_FILTER` (`store-constants.ts`):

`instrumentState`, `patternLengths`, `steps`, `masterVolume`, `tempo`, `fineTempo`.

El resto se rehidrata con valores iniciales al cargar la aplicación.

## Migraciones

`persistMigrate` en `src/app/store/stateMigration.ts` normaliza datos antiguos (tipos, rangos, claves faltantes) y aplica **`applyPersistedState`** al cargar un snapshot externo (`STATE_LOAD`). La versión actual de migración es **`STATE_MIGRATION_VERSION`**: cualquier cambio incompatible en la forma persistida debe incrementar esa versión y, si hace falta, añadir lógica de migración.

## Eventos de tiempo (`TICK` / `BLINK_TICK`)

- **`TICK`**: avanza la lógica de transporte del secuenciador (paso actual, compás, variaciones, fills) cuando el reloj de audio dispara un pulso; no sustituye al motor de audio, pero mantiene sincronizado el estado con lo que se oye.
- **`BLINK_TICK`**: alterna `blinkState` para animaciones de interfaz durante la reproducción.
