import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";

const steps = [
  {
    number: "1.",
    title: "Buyer Pays",
    description:
      "Funds are captured securely at checkout. Payment is authorized but not sent to the seller yet.",
    icon: "solar:card-outline",
    iconClass: "text-content-primary",
    bgClass: "bg-[#F5F5F5]",
  },
  {
    number: "2.",
    title: "Funds Held in Escrow",
    description:
      "Holdline keeps the funds safely guarded while the seller ships the item and tracking updates.",
    icon: "solar:lock-keyhole-outline",
    iconClass: "text-[#E59A00]",
    bgClass: "bg-[#FFF3C7]",
  },
  {
    number: "3.",
    title: "Buyer Confirms",
    description:
      "Once delivery is confirmed and verified, funds are instantly disbursed directly to the seller.",
    icon: "solar:shield-check-outline",
    iconClass: "text-success-foreground",
    bgClass: "bg-success-surface",
  },
];

export default function HowWorks() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col items-center text-center mb-14 py-4">
        <Typography
          variant="label"
          className="text-accent-default uppercase tracking-wide font-semibold text-[14px]"
        >
          Simple 3-Step Process
        </Typography>

        <Typography
          variant="h1"
          className="mt-4 text-page-inverse font-extraBold text-[36px]"
        >
          How Trustora Works
        </Typography>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row items-center lg:items-start">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex w-full flex-col items-center text-center lg:flex-1 "
          >
            <div
              className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${step.bgClass}`}
            >
              <Icon icon={step.icon} className={`h-7 w-7 ${step.iconClass}`} />
            </div>

            <div className="mt-5 max-w-[300px]">
              <Typography variant="h3" className="text-heading font-semibold">
                {step.number} {step.title}
              </Typography>

              <Typography
                variant="body"
                className="mt-2 text-content-secondary"
              >
                {step.description}
              </Typography>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden lg:block h-px w-[56px] border-t border-dashed border-outline-subtle mt-[36px]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
