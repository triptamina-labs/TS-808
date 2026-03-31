/**
 * Expone `DOMMatrix` y `DOMPoint` del [CSS Geometry Module](https://drafts.fxtf.org/geometry-1/).
 * Los usa `pointConversion.ts` para pasar coordenadas entre el espacio de un nodo y el de la página (knobs).
 *
 * En el navegador son APIs nativas. El polyfill de terceros se eliminó; en tests (jsdom sin estas APIs)
 * se inyectan desde `vitest.setup.ts` mediante happy-dom.
 */
type DOMMatrixCtor = new (init?: string | number[]) => DOMMatrix;
type DOMPointCtor = new (x?: number, y?: number, z?: number, w?: number) => DOMPoint;

const DM = (globalThis as Record<string, unknown>).DOMMatrix as DOMMatrixCtor | undefined;
const DP = (globalThis as Record<string, unknown>).DOMPoint as DOMPointCtor | undefined;

if (DM == null || DP == null) {
  throw new Error(
    "DOMMatrix y DOMPoint no están disponibles. Se requiere un navegador con CSS Geometry Module (o entorno de test configurado)."
  );
}

export const DOMMatrix = DM;
export const DOMPoint = DP;
