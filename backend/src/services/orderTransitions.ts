import { OrderEventType, Prisma } from '@prisma/client';
import { AppError } from '../lib/errors';
import { OrderStatus } from './orderStateMachine';

export interface ApplyTransitionParams {
  orderId: string;
  expectedVersion: number;
  expectedStatus: OrderStatus;
  toStatus: OrderStatus;
  actorId: string | null;
  actorRole: 'buyer' | 'seller' | 'admin' | 'system';
  eventType: OrderEventType;
  note?: string;
  extraData?: Partial<Prisma.OrderUpdateManyMutationInput>;
}

/**
 * Applies one order status transition, its audit-log row, and the version
 * bump as a single atomic write, guarded by an optimistic-concurrency check
 * (id + version + status must all still match). If another request already
 * moved the order (e.g. an admin resolving a dispute at the same instant a
 * buyer confirms receipt), `count` comes back 0 and we surface a clean 409
 * instead of corrupting state or silently overwriting the other write.
 *
 * Must be called inside an existing `prisma.$transaction` so this update and
 * the event row (and any payment/ledger write the caller makes alongside it)
 * commit or roll back together.
 */
export async function applyOrderTransition(tx: Prisma.TransactionClient, params: ApplyTransitionParams) {
  const result = await tx.order.updateMany({
    where: { id: params.orderId, version: params.expectedVersion, status: params.expectedStatus },
    data: {
      status: params.toStatus,
      version: { increment: 1 },
      ...(params.extraData ?? {}),
    },
  });

  if (result.count !== 1) {
    throw new AppError('CONFLICT', 'This order was modified by another request; please retry');
  }

  await tx.orderEvent.create({
    data: {
      orderId: params.orderId,
      actorId: params.actorId,
      actorRole: params.actorRole,
      type: params.eventType,
      fromStatus: params.expectedStatus,
      toStatus: params.toStatus,
      note: params.note,
    },
  });

  return tx.order.findUniqueOrThrow({ where: { id: params.orderId } });
}
