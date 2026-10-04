import { actorContextFor, canPerformAction, OrderStatus } from './orderStateMachine';

export interface OrderPermissions {
  isBuyer: boolean;
  isSeller: boolean;
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

export function computeOrderPermissions(
  order: PermissionOrderView,
  requester: PermissionRequester,
): OrderPermissions {
  const actor = actorContextFor(order, requester);

  return {
    isBuyer: actor.isBuyer,
    isSeller: actor.isSeller,
    canShip: canPerformAction(order.status, 'ship', actor),
    canConfirmReceipt: canPerformAction(order.status, 'confirm_receipt', actor),
    canDispute: canPerformAction(order.status, 'dispute', actor),
    canResolveDispute:
      canPerformAction(order.status, 'resolve_release', actor) ||
      canPerformAction(order.status, 'resolve_refund', actor),
  };
}
