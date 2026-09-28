import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: `How long are funds held?`,
      answer: `Funds are securely held in escrow until the buyer receives and confirms the order. Once delivery is verified, the funds are released to the seller.`,
    },
    {
      question: `What if there's a dispute?`,
      answer: `If there's a dispute, the funds remain safely held in escrow while Trustora reviews the issue. Both the buyer and seller can provide evidence to help resolve the dispute fairly.`,
    },
    {
      question: `How do seller payouts work?`,
      answer: `Once the buyer confirms delivery and the transaction is completed, the funds are released to the seller. The seller can then withdraw the available balance through their connected payout method.`,
    },
    {
      question: `Is my payment information secure?`,
      answer: `Yes. Your payment information is handled securely and is not shared with the seller. Trustora keeps transaction funds protected through the escrow process until the transaction is completed.`,
    },
  ];
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" mb-20">
      <div className="flex flex-col items-center justify-center p-5 md:p-20 gap-1">
        <Typography
          variant="label"
          className="hidden md:block text-[14px] uppercase font-semibold text-accent-default py-1"
        >
          Questions
        </Typography>
        <Typography
          variant="h1"
          className="hidden md:block font-extrabold text-page-inverse pt-2"
        >
          Frequently Asked Questions
        </Typography>
        <Typography
          variant="h1"
          className="block md:hidden font-extrabold text-page-inverse mr-70 mt-20"
        >
          FAQ
        </Typography>
      </div>

      <div className="flex flex-col items-center justify-between gap-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="min-w-[350px] md:w-[580px] lg:w-[780px]  border-b border-gray-200 rounded-lg py-[24px]"
            onClick={() => handleToggle(index)}
          >
            <div className="flex justify-between py-2">
              <Typography
                variant="label"
                className="text-[16px] font-semibold text-page-inverse"
              >
                {faq.question}
              </Typography>
              <Icon
                icon="akar-icons:chevron-right"
                className=" font-semibold text-page-inverse text-[16px]"
              ></Icon>
            </div>

            {openIndex === index && (
              <p className="w-full md:mt-2 md:mx-2 text-gray-700">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
