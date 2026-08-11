import { describe, expect, it } from 'vitest';
import {
  ORDER_STATUSES,
  OrderActorContext,
  OrderStatus,
  SYSTEM_ACTOR,
  TRANSITIONS,
  assertTransition,
  canTransition,
  InvalidTransitionError,
} from '../../services/orderStateMachine';

function actor(overrides: Partial<OrderActorContext> = {}): OrderActorContext {
  return {
    userId: 'u1',
    isBuyer: false,
    isSeller: false,
    isAdmin: false,
    isSystem: false,
    ...overrides,
  };
}

const BUYER = actor({ isBuyer: true });
const SELLER = actor({ isSeller: true });
const ADMIN = actor({ isAdmin: true });
const STRANGER = actor();

describe('order state machine: valid transitions succeed for the correct actor', () => {
  it('system captures payment: pending_payment -> paid_held', () => {
    expect(canTransition('pending_payment', 'paid_held', SYSTEM_ACTOR)).toBe(true);
  });

  it('seller ships: paid_held -> shipped', () => {
    expect(canTransition('paid_held', 'shipped', SELLER)).toBe(true);
  });

  it('buyer confirms receipt from shipped: shipped -> released', () => {
    expect(canTransition('shipped', 'released', BUYER)).toBe(true);
  });

  it('buyer confirms receipt from delivered: delivered -> released', () => {
    expect(canTransition('delivered', 'released', BUYER)).toBe(true);
  });

  it('buyer disputes from paid_held', () => {
    expect(canTransition('paid_held', 'disputed', BUYER)).toBe(true);
  });

  it('buyer disputes from shipped', () => {
    expect(canTransition('shipped', 'disputed', BUYER)).toBe(true);
  });

  it('buyer disputes from delivered', () => {
    expect(canTransition('delivered', 'disputed', BUYER)).toBe(true);
  });

  it('admin resolves dispute in favor of seller: disputed -> released', () => {
    expect(canTransition('disputed', 'released', ADMIN)).toBe(true);
  });

  it('admin resolves dispute in favor of buyer: disputed -> refunded', () => {
    expect(canTransition('disputed', 'refunded', ADMIN)).toBe(true);
  });

  it('every edge in TRANSITIONS is satisfiable by at least one actor shape', () => {
    for (const edge of TRANSITIONS) {
      const satisfiable = [BUYER, SELLER, ADMIN, SYSTEM_ACTOR].some((a) => edge.allowedActor(a));
      expect(satisfiable, `edge ${edge.from} -> ${edge.to} (${edge.action}) is unreachable by any actor`).toBe(
        true,
      );
    }
  });
});

describe('order state machine: wrong actor is rejected', () => {
  it('buyer cannot ship their own purchase', () => {
    expect(canTransition('paid_held', 'shipped', BUYER)).toBe(false);
  });

  it('seller cannot confirm receipt', () => {
    expect(canTransition('shipped', 'released', SELLER)).toBe(false);
  });

  it('seller cannot dispute', () => {
    expect(canTransition('paid_held', 'disputed', SELLER)).toBe(false);
  });

  it('buyer cannot resolve a dispute', () => {
    expect(canTransition('disputed', 'released', BUYER)).toBe(false);
    expect(canTransition('disputed', 'refunded', BUYER)).toBe(false);
  });

  it('seller cannot resolve a dispute', () => {
    expect(canTransition('disputed', 'released', SELLER)).toBe(false);
    expect(canTransition('disputed', 'refunded', SELLER)).toBe(false);
  });

  it('an unrelated stranger cannot do anything', () => {
    for (const edge of TRANSITIONS) {
      expect(canTransition(edge.from, edge.to, STRANGER)).toBe(false);
    }
  });

  it('a non-system actor cannot capture payment', () => {
    expect(canTransition('pending_payment', 'paid_held', BUYER)).toBe(false);
    expect(canTransition('pending_payment', 'paid_held', SELLER)).toBe(false);
    expect(canTransition('pending_payment', 'paid_held', ADMIN)).toBe(false);
  });
});

describe('order state machine: wrong current state / nonexistent edges are rejected', () => {
  it('cannot ship an order that has not been paid yet', () => {
    expect(canTransition('pending_payment', 'shipped', SELLER)).toBe(false);
  });

  it('cannot confirm receipt on an order still pending payment', () => {
    expect(canTransition('pending_payment', 'released', BUYER)).toBe(false);
  });

  it('cannot re-dispute an already-disputed order', () => {
    expect(canTransition('disputed', 'disputed', ADMIN)).toBe(false);
  });

  it('cannot transition out of a terminal state (released)', () => {
    for (const target of ORDER_STATUSES) {
      expect(canTransition('released', target, ADMIN)).toBe(false);
      expect(canTransition('released', target, BUYER)).toBe(false);
      expect(canTransition('released', target, SELLER)).toBe(false);
    }
  });

  it('cannot transition out of a terminal state (refunded)', () => {
    for (const target of ORDER_STATUSES) {
      expect(canTransition('refunded', target, ADMIN)).toBe(false);
    }
  });

  it('rejects a target status string that does not exist in the graph', () => {
    expect(canTransition('paid_held', 'not_a_real_status' as OrderStatus, SELLER)).toBe(false);
  });

  it('rejects a skip-ahead transition (pending_payment straight to shipped)', () => {
    expect(canTransition('pending_payment', 'shipped', SELLER)).toBe(false);
  });
});

describe('assertTransition', () => {
  it('returns the matched edge on success', () => {
    const edge = assertTransition('paid_held', 'shipped', SELLER);
    expect(edge.action).toBe('ship');
  });

  it('throws InvalidTransitionError with reason=no_such_edge for a nonexistent edge', () => {
    try {
      assertTransition('pending_payment', 'shipped', SELLER);
      expect.fail('expected assertTransition to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidTransitionError);
      expect((err as InvalidTransitionError).reason).toBe('no_such_edge');
      expect((err as InvalidTransitionError).code).toBe('INVALID_TRANSITION');
    }
  });

  it('throws InvalidTransitionError with reason=forbidden_actor for a real edge, wrong actor', () => {
    try {
      assertTransition('paid_held', 'shipped', BUYER);
      expect.fail('expected assertTransition to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidTransitionError);
      expect((err as InvalidTransitionError).reason).toBe('forbidden_actor');
    }
  });
});
