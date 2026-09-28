import Typography from "@/components/atoms/typography/typography";
import Cards from "@/components/molecules/cards/Cards";

export default function UserFeedbackSection() {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center gap-2 pt-20">
        <Typography
          variant="label"
          className="hidden md:block uppercase text-accent-default font-[600] text-[14px]"
        >
          Real user feedback
        </Typography>
        <Typography
          variant="h1"
          className="hidden md:block font-[800] text-page-inverse"
        >
          Trusted by thousands of traders
        </Typography>
        <Typography
          variant="h1"
          className="block md:hidden font-[800] text-page-inverse pb-25 pt-10"
        >
          Loved by buyers
        </Typography>
      </div>
      <div className="hidden md:flex md:flex-wrap lg:flex-nowrap items-center justify-center gap-[24px] py-20">
        <Cards
          variant="feedbackCard"
          icon="assets/images/userFeedbackProfile1.png"
          username="Sarah Jenkins"
          userRole="Verified Buyer"
        >
          “I used to worry when purchasing rare collectibles online. Holdline
          completely removed that anxiety. I could inspect my item first.”
        </Cards>
        <Cards
          variant="feedbackCard"
          icon="assets/images/useFeedbackProfile2.png"
          username="David Chen"
          userRole="Vintage Audio Merchant"
        >
          “As a high-ticket seller, fraud was a major concern. Holdline verifies
          the buyer's funds at checkout. Payout was instant upon delivery.”
        </Cards>
        <Cards
          variant="feedbackCard"
          icon="assets/images/userFeedbackProfile3.png"
          username="Marcus Vance"
          userRole="Founder, Vance Design"
        >
          “Our custom furniture business relies heavily on trust. Holdline
          protects our margins while putting our clients' minds at complete
          ease.”
        </Cards>
      </div>
    </div>
  );
}
