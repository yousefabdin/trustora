import { randomUUID } from 'crypto';

/**
 * Every method here maps 1:1 onto a real Stripe primitive so a
 * StripeConnectProvider can be swapped in later without touching any
 * order/business logic that depends on this interface:
 *
 *   captureAndHold -> PaymentIntent.create + confirm (manual capture) or
 *                      PaymentIntent.capture
 *   release        -> Transfer.create (transfer_data to the seller's
 *                      connected account)
 *   refund         -> Refund.create
 */
export interface CaptureAndHoldParams {
  orderId: string;
  amountCents: number;
  buyerId: string;
}

export interface CaptureAndHoldResult {
  providerRef: string;
}

export interface ReleaseParams {
  providerRef: string;
  sellerId: string;
  amountCents: number;
}

export interface ReleaseResult {
  transferRef: string;
}

export interface RefundParams {
  providerRef: string;
  amountCents: number;
}

export interface RefundResult {
  refundRef: string;
}

export interface PaymentProvider {
  captureAndHold(params: CaptureAndHoldParams): Promise<CaptureAndHoldResult>;
  release(params: ReleaseParams): Promise<ReleaseResult>;
  refund(params: RefundParams): Promise<RefundResult>;
}

/**
 * Simulated ledger provider: no network calls, deterministic fake refs.
 * Models the hold/release/refund lifecycle as pure internal state so it can
 * run in tests and CI with no external dependency, while keeping the same
 * shape a real Stripe-backed provider would have.
 */
export class SimulatedPaymentProvider implements PaymentProvider {
  async captureAndHold(params: CaptureAndHoldParams): Promise<CaptureAndHoldResult> {
    return { providerRef: `sim_pi_${params.orderId}_${randomUUID()}` };
  }

  async release(params: ReleaseParams): Promise<ReleaseResult> {
    return { transferRef: `sim_tr_${params.providerRef}_${randomUUID()}` };
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    return { refundRef: `sim_re_${params.providerRef}_${randomUUID()}` };
  }
}

export function getPaymentProvider(): PaymentProvider {
  return new SimulatedPaymentProvider();
}
