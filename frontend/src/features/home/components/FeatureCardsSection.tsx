import Typography from "@/components/atoms/typography/typography";
import Cards from "@/components/molecules/cards/Cards";

export default function FeatureCardsSection() {
  return (
    <>
      <section className="w-full bg-page-secondary py-15">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="py-10 ">
            <Typography
              variant="body"
              className="text-accent-default font-[600] text-[14px] uppercase font-inter"
            >
              Enterprise-grade safety
            </Typography>
            <Typography
              variant="h1"
              className="text-page-inverse font-[800] text-[36px] py-5"
            >
              Built for total transaction trust
            </Typography>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            <Cards
              variant="featureCard"
              icon="ant-design:safety-outlined"
              heading="Escrow Protection"
            >
              Zero-risk buying. Payments stay locked safely in escrow and are
              only released when you verify delivery.
            </Cards>
            <Cards
              variant="featureCard"
              icon="cil:balance-scale"
              heading="Dispute Resolution"
            >
              If something goes wrong, our neutral team reviews evidence and
              guarantees a fair resolution.
            </Cards>
            <Cards
              variant="featureCard"
              icon="iconoir:user-badge-check"
              heading="Seller Verification"
            >
              Every merchant undergoes strict identity verification and business
              checks before their first sale.
            </Cards>
            <Cards
              variant="featureCard"
              icon="hugeicons:shipping-truck-02"
              heading="Shipping Integration"
            >
              Real-time integrated package tracking automates confirmation
              milestones for frictionless handoffs.
            </Cards>
            <Cards
              variant="featureCard"
              icon="bitcoin-icons:lightning-outline"
              heading="Instant Payouts"
            >
              Once delivery is verified, we process funds straight to the
              seller's balance without delays.
            </Cards>
            <Cards
              variant="featureCard"
              icon="basil:heart-outline"
              heading="Buyer Guarantee"
            >
              If your item is broken or doesn't match the description, get a
              complete refund on us.
            </Cards>
          </div>
        </div>
      </section>
    </>
  );
}
