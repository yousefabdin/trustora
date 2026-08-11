import { Prisma } from '@prisma/client';
import { prisma } from '../db/client';
import { computeOrderPermissions } from './orderPermissions';
import { OrderStatus } from './orderStateMachine';
import { toListingResponse } from './listingView';

export const ORDER_FULL_INCLUDE = {
  listing: { include: { seller: { select: { email: true } } } },
  buyer: { select: { email: true } },
  seller: { select: { email: true } },
  events: { orderBy: { createdAt: 'asc' as const } },
} satisfies Prisma.OrderInclude;

export type FullOrder = Prisma.OrderGetPayload<{ include: typeof ORDER_FULL_INCLUDE }>;

export async function loadFullOrder(id: string): Promise<FullOrder> {
  return prisma.order.findUniqueOrThrow({ where: { id }, include: ORDER_FULL_INCLUDE });
}

export interface OrderEventResponse {
  id: string;
  actorId: string | null;
  actorRole: string;
  type: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: string;
}

export interface OrderResponse {
  id: string;
  listing: ReturnType<typeof toListingResponse>;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amountCents: number;
  status: string;
  permissions: ReturnType<typeof computeOrderPermissions>;
  events: OrderEventResponse[];
  createdAt: string;
}

export function toOrderResponse(
  order: FullOrder,
  requester: { id: string; isAdmin: boolean },
): OrderResponse {
  return {
    id: order.id,
    listing: toListingResponse(order.listing),
    buyerId: order.buyerId,
    buyerName: order.buyer.email,
    sellerId: order.sellerId,
    sellerName: order.seller.email,
    amountCents: order.amountCents,
    status: order.status,
    permissions: computeOrderPermissions(
      { status: order.status as OrderStatus, buyerId: order.buyerId, sellerId: order.sellerId },
      requester,
    ),
    events: order.events.map((event) => ({
      id: event.id,
      actorId: event.actorId,
      actorRole: event.actorRole,
      type: event.type,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      note: event.note,
      createdAt: event.createdAt.toISOString(),
    })),
    createdAt: order.createdAt.toISOString(),
  };
}
