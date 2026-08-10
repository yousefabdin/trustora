import { describe, expect, it } from 'vitest';
import { addCents, assertValidCents, isValidCents, subtractCents, centsEqual, formatCents } from '../../lib/money';

describe('isValidCents', () => {
  it('accepts non-negative integers', () => {
    expect(isValidCents(0)).toBe(true);
    expect(isValidCents(150)).toBe(true);
    expect(isValidCents(1_000_000)).toBe(true);
  });

  it('rejects floats', () => {
    expect(isValidCents(10.5)).toBe(false);
    expect(isValidCents(0.1)).toBe(false);
  });

  it('rejects negative numbers', () => {
    expect(isValidCents(-1)).toBe(false);
  });

  it('rejects non-numbers', () => {
    expect(isValidCents('100')).toBe(false);
    expect(isValidCents(null)).toBe(false);
    expect(isValidCents(undefined)).toBe(false);
    expect(isValidCents(NaN)).toBe(false);
    expect(isValidCents(Infinity)).toBe(false);
  });
});

describe('assertValidCents', () => {
  it('does not throw for valid cents', () => {
    expect(() => assertValidCents(500)).not.toThrow();
  });

  it('throws for a float', () => {
    expect(() => assertValidCents(19.99)).toThrow();
  });

  it('throws for a negative number', () => {
    expect(() => assertValidCents(-500)).toThrow();
  });
});

describe('addCents / subtractCents: no float drift, exact integer arithmetic', () => {
  it('adds cents exactly, including values that are lossy as dollars-floats', () => {
    // 0.1 + 0.2 !== 0.3 in float dollars; cents avoids that entirely.
    expect(addCents(10, 20)).toBe(30);
    expect(addCents(1, 2)).toBe(3);
  });

  it('subtracts cents exactly', () => {
    expect(subtractCents(100, 30)).toBe(70);
  });

  it('throws when subtraction would go negative', () => {
    expect(() => subtractCents(50, 100)).toThrow();
  });

  it('throws when given a non-integer operand', () => {
    expect(() => addCents(10.5, 5)).toThrow();
    expect(() => subtractCents(10.5, 5)).toThrow();
  });

  it('a long chain of cent operations accumulates with zero drift', () => {
    let total = 0;
    for (let i = 0; i < 1000; i++) {
      total = addCents(total, 3);
    }
    expect(total).toBe(3000);
  });
});

describe('centsEqual', () => {
  it('compares integer cents exactly', () => {
    expect(centsEqual(1000, 1000)).toBe(true);
    expect(centsEqual(1000, 999)).toBe(false);
  });
});

describe('formatCents', () => {
  it('formats whole dollars', () => {
    expect(formatCents(1000)).toBe('$10.00');
  });

  it('formats cents correctly, no rounding artifacts', () => {
    expect(formatCents(1050)).toBe('$10.50');
    expect(formatCents(1)).toBe('$0.01');
    expect(formatCents(0)).toBe('$0.00');
  });
});
