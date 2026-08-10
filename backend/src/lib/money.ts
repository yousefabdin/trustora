/**
 * All money in Holdline is represented as integer cents. Never floats.
 * These helpers exist so arithmetic mistakes (float drift, negative
 * amounts, non-integers) fail loudly instead of silently corrupting a ledger.
 */

export function isValidCents(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && Number.isFinite(value);
}

export function assertValidCents(value: unknown, field = 'amountCents'): asserts value is number {
  if (!isValidCents(value)) {
    throw new Error(`${field} must be a non-negative integer number of cents, got: ${String(value)}`);
  }
}

export function addCents(a: number, b: number): number {
  assertValidCents(a, 'a');
  assertValidCents(b, 'b');
  return a + b;
}

export function subtractCents(a: number, b: number): number {
  assertValidCents(a, 'a');
  assertValidCents(b, 'b');
  const result = a - b;
  if (result < 0) {
    throw new Error(`subtractCents would produce a negative amount: ${a} - ${b}`);
  }
  return result;
}

export function centsEqual(a: number, b: number): boolean {
  assertValidCents(a, 'a');
  assertValidCents(b, 'b');
  return a === b;
}

/** Formats cents as a display string, e.g. 1050 -> "$10.50". For logging/debug only, never for storage. */
export function formatCents(cents: number, currency = 'USD'): string {
  assertValidCents(cents, 'cents');
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
}
