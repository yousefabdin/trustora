import { describe, expect, it } from 'vitest';
import { computeOrderPermissions, OrderPermissions } from '../../services/orderPermissions';
import { ORDER_STATUSES, OrderStatus } from '../../services/orderStateMachine';

const BUYER_ID = 'buyer-1';
const SELLER_ID = 'seller-1';
const STRANGER_ID = 'stranger-1';
const ADMIN_ID = 'admin-1';

function orderAt(status: OrderStatus) {
  return { status, buyerId: BUYER_ID, sellerId: SELLER_ID };
}

const NONE: OrderPermissions = {
  canShip: false,
  canConfirmReceipt: false,
  canDispute: false,
  canResolveDispute: false,
};

/**
 * Expected permissions matrix, indexed by status, for each of the four
 * relationships a requester can have to an order: buyer, seller, admin
 * (assumed unrelated as buyer/seller), and an unrelated non-admin stranger.
 * This is the full role x status x action grid the spec calls for.
 */
const EXPECTED: Record<OrderStatus, { buyer: OrderPermissions; seller: OrderPermissions; admin: OrderPermissions; stranger: OrderPermissions }> = {
  pending_payment: { buyer: NONE, seller: NONE, admin: NONE, stranger: NONE },
  paid_held: {
    buyer: { ...NONE, canDispute: true },
    seller: { ...NONE, canShip: true },
    admin: NONE,
    stranger: NONE,
  },
  shipped: {
    buyer: { ...NONE, canConfirmReceipt: true, canDispute: true },
    seller: NONE,
    admin: NONE,
    stranger: NONE,
  },
  delivered: {
    buyer: { ...NONE, canConfirmReceipt: true, canDispute: true },
    seller: NONE,
    admin: NONE,
    stranger: NONE,
  },
  disputed: {
    buyer: NONE,
    seller: NONE,
    admin: { ...NONE, canResolveDispute: true },
    stranger: NONE,
  },
  refunded: { buyer: NONE, seller: NONE, admin: NONE, stranger: NONE },
  released: { buyer: NONE, seller: NONE, admin: NONE, stranger: NONE },
};

describe('computeOrderPermissions: full role x status matrix', () => {
  for (const status of ORDER_STATUSES) {
    describe(`status = ${status}`, () => {
      it('buyer', () => {
        expect(computeOrderPermissions(orderAt(status), { id: BUYER_ID, isAdmin: false })).toEqual(
          EXPECTED[status].buyer,
        );
      });

      it('seller', () => {
        expect(computeOrderPermissions(orderAt(status), { id: SELLER_ID, isAdmin: false })).toEqual(
          EXPECTED[status].seller,
        );
      });

      it('admin (not party to the order)', () => {
        expect(computeOrderPermissions(orderAt(status), { id: ADMIN_ID, isAdmin: true })).toEqual(
          EXPECTED[status].admin,
        );
      });

      it('unrelated stranger', () => {
        expect(computeOrderPermissions(orderAt(status), { id: STRANGER_ID, isAdmin: false })).toEqual(
          EXPECTED[status].stranger,
        );
      });
    });
  }
});

describe('computeOrderPermissions: specific negative cases called out by spec', () => {
  it('a seller cannot confirm receipt on their own sold order once shipped', () => {
    const perms = computeOrderPermissions(orderAt('shipped'), { id: SELLER_ID, isAdmin: false });
    expect(perms.canConfirmReceipt).toBe(false);
  });

  it('a non-admin (including the buyer and seller) cannot resolve a dispute', () => {
    for (const id of [BUYER_ID, SELLER_ID, STRANGER_ID]) {
      const perms = computeOrderPermissions(orderAt('disputed'), { id, isAdmin: false });
      expect(perms.canResolveDispute).toBe(false);
    }
  });

  it('a buyer cannot ship their own purchase', () => {
    const perms = computeOrderPermissions(orderAt('paid_held'), { id: BUYER_ID, isAdmin: false });
    expect(perms.canShip).toBe(false);
  });

  it('an admin who happens to also be the buyer still cannot resolve disputes as buyer -- admin flag drives it, not relationship', () => {
    // admin resolving requires isAdmin=true; being the buyer grants nothing extra here.
    const perms = computeOrderPermissions(orderAt('disputed'), { id: BUYER_ID, isAdmin: true });
    expect(perms.canResolveDispute).toBe(true);
  });

  it('nobody can do anything on a released (terminal) order', () => {
    for (const requester of [
      { id: BUYER_ID, isAdmin: false },
      { id: SELLER_ID, isAdmin: false },
      { id: ADMIN_ID, isAdmin: true },
    ]) {
      expect(computeOrderPermissions(orderAt('released'), requester)).toEqual(NONE);
    }
  });

  it('nobody can do anything on a refunded (terminal) order', () => {
    for (const requester of [
      { id: BUYER_ID, isAdmin: false },
      { id: SELLER_ID, isAdmin: false },
      { id: ADMIN_ID, isAdmin: true },
    ]) {
      expect(computeOrderPermissions(orderAt('refunded'), requester)).toEqual(NONE);
    }
  });
});
