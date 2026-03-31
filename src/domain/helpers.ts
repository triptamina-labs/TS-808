import type { Part, Variation } from "store-constants";

export function stepKey(
  pattern: number,
  instrument: number,
  part: Part,
  variation: Variation,
  step: number
) {
  return `PATTERN_${pattern}-INSTRUMENT_${instrument}-${part}-${variation}-STEP_${step}`;
}

export function patternLengthKey(pattern: number, part: Part) {
  return `PATTERN_${pattern}-${part}-LENGTH`;
}

export function snap(number: number, increment: number, offset: number) {
  return Math.round(number / increment) * increment + offset;
}

// Taken from http://raganwald.com/2015/06/26/decorators-in-es7.html
export function mixin<T extends object, S extends object = object>(
  behaviour: T,
  sharedBehaviour = {} as S
) {
  const instanceKeys = Reflect.ownKeys(behaviour);
  const sharedKeys = Reflect.ownKeys(sharedBehaviour);
  const typeTag = Symbol("isa");

  function _mixin<C extends new (...args: never[]) => object>(clazz: C) {
    for (const property of instanceKeys) {
      Object.defineProperty(clazz.prototype, property, {
        value: (behaviour as Record<PropertyKey, unknown>)[property],
        writable: true
      });
    }
    Object.defineProperty(clazz.prototype, typeTag, { value: true });
    return clazz;
  }

  for (const property of sharedKeys) {
    Object.defineProperty(_mixin, property, {
      value: (sharedBehaviour as Record<PropertyKey, unknown>)[property],
      enumerable: Object.prototype.propertyIsEnumerable.call(sharedBehaviour, property)
    });
  }

  Object.defineProperty(_mixin, Symbol.hasInstance, {
    value: (instance: Record<PropertyKey, unknown>) => Boolean(instance[typeTag])
  });

  return _mixin;
}

// Input should be a value 0 to 100, outputs 0.0 to 1.0.
export function equalPower(input: number) {
  const output = Math.cos((1.0 - input / 100) * 0.5 * Math.PI);
  return Math.round(output * 100) / 100;
}

export function noop() {
  return undefined;
}
