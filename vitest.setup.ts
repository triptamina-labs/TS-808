import { Window } from "happy-dom";

/**
 * jsdom no define DOMMatrix / DOMPoint; la app los necesita al cargar módulos que importan `geometry.ts`.
 * happy-dom sí los expone y se usa solo en Vitest (devDependency).
 */
const win = new Window();

Object.assign(globalThis, {
  DOMMatrix: win.DOMMatrix,
  DOMPoint: win.DOMPoint
});
