import { memoize } from '../src/memoize';

describe('memoize utility', () => {
  it('should cache method results for same arguments', () => {
    let callCount = 0;
    class Test {
      @memoize
      add(a: number, b: number): number {
        callCount++;
        return a + b;
      }
    }
    const t = new Test();
    expect(t.add(1, 2)).toBe(3);
    expect(t.add(1, 2)).toBe(3);
    expect(callCount).toBe(1); // Only called once for same args
    expect(t.add(2, 3)).toBe(5);
    expect(callCount).toBe(2);
  });

  it('should cache getter results', () => {
    let callCount = 0;
    class Test {
      private _val = 42;
      @memoize
      get value(): number {
        callCount++;
        return this._val;
      }
    }
    const t = new Test();
    expect(t.value).toBe(42);
    expect(t.value).toBe(42);
    expect(callCount).toBe(1);
  });

  it('should cache per instance', () => {
    let callCount = 0;
    class Test {
      @memoize
      foo(x: number): number {
        callCount++;
        return x * 2;
      }
    }
    const t1 = new Test();
    const t2 = new Test();
    expect(t1.foo(1)).toBe(2);
    expect(t2.foo(1)).toBe(2);
    expect(callCount).toBe(2); // Each instance caches separately
  });
}); 