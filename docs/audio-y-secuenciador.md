# Audio y secuenciador

## Contexto de audio (`audioCtxContext.tsx`)

- Singleton de **`AudioContext`** y de **`WAAClock`** asociado.
- **`requestInit()`** crea el contexto si aún no existe, reproduce un buffer silencioso breve (truco habitual para “desbloquear” el audio en algunos navegadores) e instancia WAAClock con tolerancia temprana configurada.
- Compatibilidad: intenta `AudioContext` y cae a `webkitAudioContext` si hace falta.

## Componente `Sequencer` (`domain/audio/sequencer.tsx`)

- No renderiza UI (`return null`); solo conecta el reloj con el store y la cadena de salida.
- Al **iniciar reproducción** (`playing === true`): arranca el reloj, programa un evento periódico con `callbackAtTime(...).repeat(beatDuration)` donde `beatDuration = 60 / (tempo + fineTempo) / 4` (negra subdividida en cuatro).
- En cada callback de audio llama a **`stepTrigger`** con una **instantánea** del estado (`store.getState()`), el tiempo límite (`deadline`), el nodo de ganancia de salida, el reloj y el contexto.
- Programa el siguiente **`TICK`** en Redux con `clock.setTimeout` alineado al tiempo de audio.
- **Salida**: cadena **VCA (ganancia maestra)** → **Limiter** → `destination`. El volumen maestro usa curva tipo *equal power* (`equalPower` en `helpers`).
- **Cambio de tempo en marcha**: `timeStretch` del WAAClock sobre el evento de tick activo.
- **Parada**: limpia el evento repetido y detiene el reloj.

## `stepTrigger` (`domain/audio/synth/stepTrigger.ts`)

- Recorre los instrumentos (excepto el acento como fuente independiente: el acento modula ganancia vía `getAccentGain`).
- Para cada instrumento con paso activo en el patrón actual, invoca el módulo de tambor correspondiente (`drumModuleMapping`).
- Mantiene **`previousTriggers`**: referencias a VCAs anteriores para silenciar antes de un nuevo disparo en el mismo canal.

## Módulos de síntesis (`domain/audio/synth/`)

- **`drumModules/`**: un archivo por familia (bombo, caja, platos, congas/toms, etc.), construyendo grafos de nodos Web Audio (osciladores, ruido, filtros, envolventes).
- **`basics/`**: primitivas reutilizables (VCA, VCO, envolventes, etc.).
- **`effects/`**: p. ej. limitador, soft clipper, rectificación.

Los módulos se apoyan en clases tipo **`WebAudioModule`** (`webAudioModule.ts`) para conectar nodos de forma coherente.

## Precisión

La temporización depende de **WAAClock** y del `AudioContext.currentTime`, no de `setInterval` para los golpes (salvo `BLINK_TICK` en UI, que usa un intervalo de 750 ms solo para parpadeo visual).
