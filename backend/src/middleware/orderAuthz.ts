import { NextFunction, Request, Response } from 'express';
import { Order } from '@prisma/client';
import { prisma } from '../db/client';
import { AppError, forbidden, notFound } from '../lib/errors';
import { asyncHandler } from '../lib/asyncHandler';
import { InvalidTransitionError, OrderStatus, actorContextFor, assertTransition } from '../services/orderStateMachine';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      order?: Order;
    }
  }
}

/**
 * Loads the order named by req.params.id and rejects any requester who is
 * not the buyer, the seller, or an admin for THIS SPECIFIC order — never
 * trusts req.user.roles alone. Every order-scoped route runs this before
 * its handler, so an unauthorized actor's request never reaches business
 * logic (404 if the order doesn't exist, 403 if it exists but isn't theirs).
 */
export const loadOrderForParty = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order) {
    throw notFound('Order');
  }

  const user = req.user!;
  const isParty = user.id === order.buyerId || user.id === order.sellerId || user.isAdmin;
  if (!isParty) {
    throw forbidden('You are not a party to this order');
  }

  req.order = order;
  next();
});

function toAppError(err: InvalidTransitionError): AppError {
  if (err.reason === 'forbidden_actor') {
    return new AppError('FORBIDDEN', err.message);
  }
  return new AppError('INVALID_TRANSITION', err.message);
}

/**
 * Runs the state-machine guard as middleware (must run after loadOrderForParty
 * and after any body validation the target status depends on) so a
 * disallowed transition is rejected before any business logic executes,
 * never as an if-statement buried inside the handler.
 */
export function requireOrderTransition(resolveTarget: (req: Request) => OrderStatus) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const order = req.order!;
    const actor = actorContextFor(order, req.user!);
    const target = resolveTarget(req);
    try {
      assertTransition(order.status as OrderStatus, target, actor);
      next();
    } catch (err) {
      if (err instanceof InvalidTransitionError) {
        next(toAppError(err));
        return;
      }
      next(err);
    }
  };
}
