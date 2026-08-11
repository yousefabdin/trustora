import { actorContextFor, canPerformAction, OrderStatus } from './orderStateMachine';

export interface OrderPermissions {
  canShip: boolean;
  canConfirmReceipt: boolean;
  canDispute: boolean;
  canResolveDispute: boolean;
}

export interface PermissionOrderView {
  status: OrderStatus;
  buyerId: string;
  sellerId: string;
}

export interface PermissionRequester {
  id: string;
  isAdmin: boolean;
}

/**
 * The single, pure function that decides what a given requester may currently
 * do to a given order. Deliberately implemented in terms of canPerformAction
 * (backed by the same TRANSITIONS table route handlers assert against) so
 * this can never drift out of sync with what the state machine actually
 * allows — there is no second copy of the authz rules to maintain.
 */
export function computeOrderPermissions(
  order: PermissionOrderView,
  requester: PermissionRequester,
): OrderPermissions {
  const actor = actorContextFor(order, requester);

  return {
    canShip: canPerformAction(order.status, 'ship', actor),
    canConfirmReceipt: canPerformAction(order.status, 'confirm_receipt', actor),
    canDispute: canPerformAction(order.status, 'dispute', actor),
    canResolveDispute:
      canPerformAction(order.status, 'resolve_release', actor) ||
      canPerformAction(order.status, 'resolve_refund', actor),
  };
}
