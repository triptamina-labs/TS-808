# Interfaz y comportamiento

## Modos (`store-constants.ts`)

Los modos están numerados de `MODE_PATTERN_CLEAR` (0) a `MODE_RHYTHM_TRACK_COMPOSE` (5). La constante **`UNIMPLEMENTED_MODES`** incluye:

- **`MODE_RHYTHM_TRACK_PLAY`** (etiqueta UI “Play”)
- **`MODE_RHYTHM_TRACK_COMPOSE`** (etiqueta UI “Compose”)

En `bottomSection/index.tsx`, si el modo seleccionado está en esa lista, la interacción con ciertos controles queda **deshabilitada** hasta que se implementen PLAY y COMPOSE como en el hardware original.

## PRE-SCALE

El interruptor visual está en `preScaleSwitch/index.tsx` con **`disabled={true}`** y **`onChange={noOp}`**: no modifica estado.

En `connectedComponents.tsx`, **`ConnectedPreScaleSwitch`** fuerza la posición con `useSelector(() => 2)`, que corresponde a la opción **“3”** en la escala 1–4 del interruptor. Existe la acción **`PRE_SCALE_CHANGE`** en tipos y creadores, pero el componente conectado no actualiza el estado de forma útil a través del reducer principal (comportamiento pendiente de completar).

## Botón TAP

**`TAP_BUTTON_CLICK`** está cableado en el reducer: en **`MODE_MANUAL_PLAY`** alterna **`fillScheduled`**; en otros modos el estado no cambia. No existe aún la función de “tap para introducir notas/triggers” del TR-808 original.

## Guardado y carga

- **Guardar**: el snapshot incluye los mismos campos que la persistencia (`instrumentState`, `patternLengths`, `steps`, `masterVolume`, `tempo`, `fineTempo`) más **`playing`** para el archivo exportado (véase `saveButton`).
- **Cargar**: hidrata mediante la acción **`STATE_LOAD`**, que usa **`applyPersistedState`** para fusionar con el estado base y validar tipos.

## Patrones y pasos

- Hay **16 pistas de patrón** (índices de 0 a 15) y pasos indexados hasta 16 por combinación pista/instrumento/parte/variación (`initialState` en `initialState.ts`).
- Las longitudes iniciales por pista/parte se definen en **`initialRhythmLengthState`** (p. ej. primera parte a 16 pasos).

Para el alcance funcional pendiente (PLAY/COMPOSE, PRE-SCALE completo, TAP avanzado), véase también la sección correspondiente del [README principal](../README.md).
