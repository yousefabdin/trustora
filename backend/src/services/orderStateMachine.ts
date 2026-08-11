/**
 * The order state machine — the single source of truth for which order status
 * transitions exist and who is allowed to trigger them. Route handlers must
 * never branch on status/actor themselves; they call assertTransition (or
 * canTransition) and let this module decide.
 *
 * Graph (per spec):
 *
 *   pending_payment -> paid_held -> shipped -> delivered -> released
 *                                        \          \
 *                                     disputed <- (dispute from paid_held/shipped/delivered)
 *                                     disputed -> refunded
 *                                     disputed -> released   (admin resolves for seller)
 *
 * Note: no endpoint in this API ever moves an order INTO `delivered` — the
 * `confirm_receipt` action goes shipped -> released directly, per the spec's
 * explicit rule ("shipped|delivered -> released"). `delivered` remains a
 * legal state in the graph (dispute is still reachable from it) so a future
 * carrier-webhook integration can set it without changing this module.
 */

export type OrderStatus =
  | 'pending_payment'
  | 'paid_held'
  | 'shipped'
  | 'delivered'
  | 'disputed'
  | 'refunded'
  | 'released';

export const ORDER_STATUSES: readonly OrderStatus[] = [
  'pending_payment',
  'paid_held',
  'shipped',
  'delivered',
  'disputed',
  'refunded',
  'released',
];

export type TransitionAction =
  | 'capture_payment'
  | 'ship'
  | 'confirm_receipt'
  | 'dispute'
  | 'resolve_release'
  | 'resolve_refund';

export interface OrderActorContext {
  userId: string | null;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isSystem: boolean;
}

export interface TransitionEdge {
  from: OrderStatus;
  to: OrderStatus;
  action: TransitionAction;
  allowedActor: (actor: OrderActorContext) => boolean;
}

export const TRANSITIONS: readonly TransitionEdge[] = [
  {
    from: 'pending_payment',
    to: 'paid_held',
    action: 'capture_payment',
    allowedActor: (actor) => actor.isSystem,
  },
  {
    from: 'paid_held',
    to: 'shipped',
    action: 'ship',
    allowedActor: (actor) => actor.isSeller,
  },
  {
    from: 'shipped',
    to: 'released',
    action: 'confirm_receipt',
    allowedActor: (actor) => actor.isBuyer,
  },
  {
    from: 'delivered',
    to: 'released',
    action: 'confirm_receipt',
    allowedActor: (actor) => actor.isBuyer,
  },
  {
    from: 'paid_held',
    to: 'disputed',
    action: 'dispute',
    allowedActor: (actor) => actor.isBuyer,
  },
  {
    from: 'shipped',
    to: 'disputed',
    action: 'dispute',
    allowedActor: (actor) => actor.isBuyer,
  },
  {
    from: 'delivered',
    to: 'disputed',
    action: 'dispute',
    allowedActor: (actor) => actor.isBuyer,
  },
  {
    from: 'disputed',
    to: 'released',
    action: 'resolve_release',
    allowedActor: (actor) => actor.isAdmin,
  },
  {
    from: 'disputed',
    to: 'refunded',
    action: 'resolve_refund',
    allowedActor: (actor) => actor.isAdmin,
  },
];

function findEdge(current: OrderStatus, next: OrderStatus): TransitionEdge | undefined {
  return TRANSITIONS.find((edge) => edge.from === current && edge.to === next);
}

export function canTransition(current: OrderStatus, next: OrderStatus, actor: OrderActorContext): boolean {
  const edge = findEdge(current, next);
  if (!edge) return false;
  return edge.allowedActor(actor);
}

/** True if this edge exists in the graph at all, regardless of who the actor is. Used to distinguish 4xx reasons. */
export function edgeExists(current: OrderStatus, next: OrderStatus): boolean {
  return findEdge(current, next) !== undefined;
}

/**
 * Checks eligibility by action rather than by target status. This matters
 * because two different actions can land on the same target status from
 * different source states (e.g. both `confirm_receipt` and `resolve_release`
 * end at `released`) — permission checks care "can this actor confirm
 * receipt right now", not "can this actor somehow reach `released`".
 */
export function canPerformAction(
  current: OrderStatus,
  action: TransitionAction,
  actor: OrderActorContext,
): boolean {
  return TRANSITIONS.some(
    (edge) => edge.from === current && edge.action === action && edge.allowedActor(actor),
  );
}

export class InvalidTransitionError extends Error {
  readonly code = 'INVALID_TRANSITION' as const;
  readonly current: OrderStatus;
  readonly next: OrderStatus;
  readonly reason: 'no_such_edge' | 'forbidden_actor';

  constructor(current: OrderStatus, next: OrderStatus, reason: 'no_such_edge' | 'forbidden_actor') {
    const message =
      reason === 'no_such_edge'
        ? `Cannot transition order from '${current}' to '${next}': no such transition exists`
        : `Cannot transition order from '${current}' to '${next}': actor is not permitted to perform this transition`;
    super(message);
    this.name = 'InvalidTransitionError';
    this.current = current;
    this.next = next;
    this.reason = reason;
  }
}

/**
 * Throws InvalidTransitionError if the transition is not allowed; otherwise
 * returns the matched edge (including the TransitionAction, useful for
 * writing the audit event).
 */
export function assertTransition(
  current: OrderStatus,
  next: OrderStatus,
  actor: OrderActorContext,
): TransitionEdge {
  const edge = findEdge(current, next);
  if (!edge) {
    throw new InvalidTransitionError(current, next, 'no_such_edge');
  }
  if (!edge.allowedActor(actor)) {
    throw new InvalidTransitionError(current, next, 'forbidden_actor');
  }
  return edge;
}

export const SYSTEM_ACTOR: OrderActorContext = {
  userId: null,
  isBuyer: false,
  isSeller: false,
  isAdmin: false,
  isSystem: true,
};

export function actorContextFor(
  order: { buyerId: string; sellerId: string },
  requester: { id: string; isAdmin: boolean },
): OrderActorContext {
  return {
    userId: requester.id,
    isBuyer: requester.id === order.buyerId,
    isSeller: requester.id === order.sellerId,
    isAdmin: requester.isAdmin,
    isSystem: false,
  };
}
