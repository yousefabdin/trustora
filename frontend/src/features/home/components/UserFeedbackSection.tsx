import Typography from "@/components/atoms/typography/Typography";
import Cards from "@/components/molecules/cards/Cards";
import { useState, useRef } from "react";

const feedbacks = [
  {
    id: 1,
    quote:
      "“I used to worry when purchasing rare collectibles online. Holdline completely removed that anxiety.”",
    icon: "/assets/images/userFeedbackProfile1.png",
    username: "Sarah Jenkins",
    userRole: "Verified Buyer",
  },
  {
    id: 2,
    quote:
      "“As a high-ticket seller, fraud was a major concern. Holdline verifies the buyer's funds at checkout. Payout was instant upon delivery.”",
    icon: "/assets/images/useFeedbackProfile2.png",
    username: "David Chen",
    userRole: "Vintage Audio Merchant",
  },
  {
    id: 3,
    quote:
      "“Our custom furniture business relies heavily on trust. Holdline protects our margins while putting our clients' minds at complete ease.”",
    icon: "/assets/images/userFeedbackProfile3.png",
    username: "Marcus Vance",
    userRole: "Founder, Vance Design",
  },
];

export default function UserFeedbackSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % feedbacks.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center gap-2 pt-16 md:pt-20">
        <Typography
          variant="label"
          className="hidden md:block uppercase text-accent-default font-[600] text-[14px]"
        >
          Real user feedback
        </Typography>
        <Typography
          variant="h1"
          className="hidden md:block font-[800] text-page-inverse text-[32px] md:text-[36px]"
        >
          Trusted by thousands of traders
        </Typography>
        <Typography
          variant="h1"
          className="block md:hidden font-[800] text-page-inverse text-[28px] sm:text-[32px] pt-4 pb-8 text-center"
        >
          Loved by buyers
        </Typography>
      </div>

      <div
        className="block md:hidden w-full px-4 flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-[360px] bg-page-primary border border-outline-subtle rounded-[20px] p-6 sm:p-7 shadow-xs min-h-[220px] flex flex-col justify-between transition-all duration-300">
          <p className="text-[14.5px] italic text-content-secondary leading-relaxed font-normal">
            {feedbacks[activeIndex].quote}
          </p>

          <div className="flex items-center gap-3 pt-5">
            <img
              src={feedbacks[activeIndex].icon}
              alt={feedbacks[activeIndex].username}
              className="w-11 h-11 rounded-full object-cover shrink-0 border border-outline-subtle"
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-content-primary leading-tight">
                {feedbacks[activeIndex].username}
              </span>
              <span className="text-[12.5px] text-content-tertiary mt-0.5">
                {feedbacks[activeIndex].userRole}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 pt-6 pb-12">
          {feedbacks.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to feedback ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? "w-6 bg-accent-default"
                  : "w-1.5 bg-[#E4E4E7] hover:bg-content-tertiary"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:flex md:flex-wrap lg:flex-nowrap items-center justify-center gap-[24px] py-16 lg:py-20 px-4">
        {feedbacks.map((fb) => (
          <Cards
            key={fb.id}
            variant="feedbackCard"
            icon={fb.icon}
            username={fb.username}
            userRole={fb.userRole}
          >
            {fb.quote}
          </Cards>
        ))}
      </div>
    </div>
  );
}
