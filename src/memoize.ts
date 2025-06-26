// Memoization decorator for instance methods and getters
// Usage: @memoize on a method or getter

const cache = new WeakMap<object, Map<string, unknown>>();

function getInstanceCache(instance: object): Map<string, unknown> {
  if (!cache.has(instance)) {
    cache.set(instance, new Map());
  }
  return cache.get(instance)!;
}

export function memoize(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.get || descriptor.value;
  const isGetter = !!descriptor.get;

  if (isGetter) {
    descriptor.get = function () {
      const instanceCache = getInstanceCache(this);

      if (!instanceCache.has(propertyKey)) {
        instanceCache.set(propertyKey, originalMethod.call(this));
      }

      return instanceCache.get(propertyKey);
    };
  } else {
    descriptor.value = function (...args: unknown[]) {
      const instanceCache = getInstanceCache(this);
      const key = `${propertyKey}:${JSON.stringify(args)}`;

      if (!instanceCache.has(key)) {
        instanceCache.set(key, originalMethod.apply(this, args));
      }

      return instanceCache.get(key);
    };
  }

  return descriptor;
}
