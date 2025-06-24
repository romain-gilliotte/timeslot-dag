// Memoization decorator for instance methods and getters
// Usage: @memoize on a method or getter

export function memoize(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.get || descriptor.value;
  const isGetter = !!descriptor.get;
  const cacheKey = Symbol(`__memoized_${propertyKey}`);

  if (isGetter) {
    descriptor.get = function() {
      if (!(cacheKey in this)) {
        Object.defineProperty(this, cacheKey, {
          value: originalMethod.call(this),
          writable: false,
          enumerable: false,
          configurable: false,
        });
      }
      return (this as Record<symbol, unknown>)[cacheKey];
    };
  } else {
    descriptor.value = function(...args: unknown[]) {
      if (!(this as Record<string, Record<string, unknown>>).__memoize_cache) {
        Object.defineProperty(this, '__memoize_cache', {
          value: {},
          writable: false,
          enumerable: false,
          configurable: false,
        });
      }
      const key = propertyKey + JSON.stringify(args);
      if (!(this as Record<string, Record<string, unknown>>).__memoize_cache[key]) {
        (this as Record<string, Record<string, unknown>>).__memoize_cache[key] = originalMethod.apply(this, args);
      }
      return (this as Record<string, Record<string, unknown>>).__memoize_cache[key];
    };
  }
  
  return descriptor;
} 