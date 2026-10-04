import Typography from "@/components/atoms/typography/typography";
import clsx from "clsx";
import { formatActivityDate } from "@/utils/dateUtils";

interface StatusDateItem {
  date: string;
  status: string;
  title?: string;
  description?: string;
}

interface StepperBarProps {
  order?: any;
  currentStep?: number;
  isDisputed?: boolean;
  statusDate?: StatusDateItem[];
}

export default function StepperBar({
  order,
  currentStep = 2,
  isDisputed = false,
  statusDate = [],
}: StepperBarProps) {
  const events: any[] = order?.events || [];
  const statusHistory: StatusDateItem[] = statusDate.length > 0 ? statusDate : order?.statusHistory || [];

  const disputed =
    Boolean(isDisputed) ||
    order?.status === "Disputed" ||
    order?.rawStatus === "disputed" ||
    events.some((e) => e.type === "disputed" || e.toStatus === "disputed");

  const findStepDate = (key: string): string => {
    switch (key) {
      case "captured": {
        const ev = events.find((e) => e.type === "created" || e.toStatus === "pending_payment");
        if (ev?.createdAt) return ev.createdAt;
        const sh = statusHistory.find(
          (s) =>
            s.status?.toLowerCase().includes("pending") ||
            s.status?.toLowerCase().includes("captured") ||
            (s.title && s.title.toLowerCase().includes("order"))
        );
        if (sh?.date) return sh.date;
        return order?.createdAt || "";
      }
      case "escrow": {
        const ev = events.find((e) => e.type === "payment_held" || e.toStatus === "paid_held");
        if (ev?.createdAt) return ev.createdAt;
        const sh = statusHistory.find(
          (s) =>
            s.status?.toLowerCase().includes("escrow") ||
            (s.title && (s.title.toLowerCase().includes("secured") || s.title.toLowerCase().includes("held")))
        );
        if (sh?.date) return sh.date;
        if (
          currentStep >= 2 ||
          order?.status === "In Escrow" ||
          order?.rawStatus === "paid_held" ||
          order?.rawStatus === "shipped" ||
          order?.rawStatus === "delivered" ||
          order?.rawStatus === "disputed" ||
          order?.rawStatus === "released"
        ) {
          return order?.createdAt || "";
        }
        return "";
      }
      case "shipped": {
        const ev = events.find((e) => e.type === "shipped" || e.toStatus === "shipped");
        if (ev?.createdAt) return ev.createdAt;
        const sh = statusHistory.find(
          (s) =>
            s.status?.toLowerCase() === "shipped" ||
            (s.title && s.title.toLowerCase().includes("shipped"))
        );
        return sh?.date || "";
      }
      case "delivered": {
        const ev = events.find((e) => e.type === "delivered" || e.toStatus === "delivered");
        if (ev?.createdAt) return ev.createdAt;
        const sh = statusHistory.find(
          (s) =>
            s.status?.toLowerCase() === "delivered" ||
            (s.title && s.title.toLowerCase().includes("delivered"))
        );
        return sh?.date || "";
      }
      case "disputed": {
        const ev = events.find((e) => e.type === "disputed" || e.toStatus === "disputed");
        if (ev?.createdAt) return ev.createdAt;
        const sh = statusHistory.find(
          (s) =>
            s.status?.toLowerCase() === "disputed" ||
            (s.title && s.title.toLowerCase().includes("dispute"))
        );
        if (sh?.date) return sh.date;
        return "";
      }
      case "released": {
        const ev = events.find(
          (e) =>
            e.type === "receipt_confirmed" ||
            e.type === "dispute_resolved_release" ||
            e.toStatus === "released"
        );
        if (ev?.createdAt) return ev.createdAt;
        const sh = statusHistory.find(
          (s) =>
            s.status?.toLowerCase() === "completed" ||
            (s.title && s.title.toLowerCase().includes("released"))
        );
        return sh?.date || "";
      }
      default:
        return "";
    }
  };

  const getDisputeOriginKey = (): "captured" | "escrow" | "shipped" | "delivered" => {
    const disputeEv = events.find((e) => e.type === "disputed" || e.toStatus === "disputed");
    if (disputeEv?.fromStatus) {
      if (disputeEv.fromStatus === "delivered") return "delivered";
      if (disputeEv.fromStatus === "shipped") return "shipped";
      if (disputeEv.fromStatus === "paid_held") return "escrow";
      if (disputeEv.fromStatus === "pending_payment") return "captured";
    }

    if (events.some((e) => e.type === "delivered" || e.toStatus === "delivered")) {
      return "delivered";
    }
    if (events.some((e) => e.type === "shipped" || e.toStatus === "shipped") || order?.trackingInfo) {
      return "shipped";
    }
    if (events.some((e) => e.type === "payment_held" || e.toStatus === "paid_held") || currentStep >= 2) {
      return "escrow";
    }
    return "captured";
  };

  let desktopSteps: {
    id: string;
    name: string;
    date: string;
    isCompleted: boolean;
    isActive: boolean;
    isDispute: boolean;
  }[] = [];

  let mobileSteps: {
    id: string;
    name: string;
    date: string;
    isCompleted: boolean;
    isActive: boolean;
    isDispute: boolean;
  }[] = [];

  if (disputed) {
    const origin = getDisputeOriginKey();

    const standardSteps = [
      { id: "captured", name: "Captured" },
      { id: "escrow", name: "Held in Escrow" },
      { id: "shipped", name: "Item Shipped" },
      { id: "delivered", name: "Delivered" },
    ];

    const originIndex = standardSteps.findIndex((s) => s.id === origin);
    const validOriginIdx = originIndex >= 0 ? originIndex : 1;

    const completedPreSteps = standardSteps.slice(0, validOriginIdx + 1).map((s) => ({
      id: s.id,
      name: s.name,
      date: formatActivityDate(findStepDate(s.id)),
      isCompleted: true,
      isActive: false,
      isDispute: false,
    }));

    const disputeStep = {
      id: "disputed",
      name: "Dispute Opened by Buyer",
      date: formatActivityDate(findStepDate("disputed")),
      isCompleted: false,
      isActive: false,
      isDispute: true,
    };

    desktopSteps = [...completedPreSteps, disputeStep];

    if (desktopSteps.length < 5) {
      desktopSteps.push({
        id: "resolution",
        name: "Resolution Pending",
        date: "",
        isCompleted: false,
        isActive: false,
        isDispute: false,
      });
    }

    mobileSteps = [...completedPreSteps, disputeStep];
  } else {
    const standardSteps = [
      { id: "captured", name: "Captured" },
      { id: "escrow", name: "Held in Escrow" },
      { id: "shipped", name: "Item Shipped" },
      { id: "delivered", name: "Delivered" },
      { id: "released", name: "Funds Released" },
    ];

    desktopSteps = standardSteps.map((step, idx) => {
      const stepNumber = idx + 1;
      const isCompleted = stepNumber < currentStep;
      const isActive = stepNumber === currentStep;
      const rawDate = isCompleted || isActive ? findStepDate(step.id) : "";

      return {
        id: step.id,
        name: step.name,
        date: formatActivityDate(rawDate),
        isCompleted,
        isActive,
        isDispute: false,
      };
    });

    mobileSteps = desktopSteps;
  }

  return (
    <div className="w-full">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden w-full md:flex">
        {desktopSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isLastStep = index === desktopSteps.length - 1;
          const nextStep = !isLastStep ? desktopSteps[index + 1] : null;
          const lineToNextIsRed = nextStep?.isDispute;

          return (
            <div
              key={step.id}
              className="relative flex flex-1 flex-col items-center"
            >
              <div
                className={clsx(
                  "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-all",
                  step.isDispute &&
                    "!border-2 !border-red-500 bg-red-50 text-red-600 shadow-xs",
                  step.isCompleted &&
                    !step.isDispute &&
                    "border-0 bg-emerald-600 text-white shadow-xs",
                  step.isActive &&
                    !step.isDispute &&
                    "border-[3px] border-amber-500 bg-white shadow-xs",
                  !step.isCompleted &&
                    !step.isActive &&
                    !step.isDispute &&
                    "border-2 border-neutral-300 bg-white"
                )}
              >
                {step.isCompleted && !step.isDispute && (
                  <span className="text-xs font-bold leading-none">✓</span>
                )}
                {step.isDispute && (
                  <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
                )}
                {step.isActive && !step.isDispute && (
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                )}
              </div>

              {!isLastStep && (
                <div
                  className={clsx(
                    "absolute left-1/2 right-[-50%] top-3.5 h-[2px] -translate-y-1/2",
                    lineToNextIsRed
                      ? "bg-red-500"
                      : step.isCompleted && !step.isDispute
                      ? "bg-emerald-600"
                      : "border-t-2 border-dashed border-neutral-200"
                  )}
                />
              )}

              <div className="mt-2 text-center flex flex-col items-center">
                <span
                  className={clsx(
                    "text-xs md:text-sm leading-tight",
                    step.isDispute
                      ? "font-semibold text-red-600"
                      : step.isActive
                      ? "font-semibold text-neutral-900"
                      : step.isCompleted
                      ? "font-medium text-neutral-700"
                      : "text-neutral-400"
                  )}
                >
                  {stepNumber}. {step.name}
                </span>

                {step.date && (
                  <span
                    className={clsx(
                      "block text-xs font-mono mt-0.5",
                      step.isDispute
                        ? "text-red-500 font-medium"
                        : "text-neutral-400"
                    )}
                  >
                    {step.date}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper (Matches Reference Image) */}
      <div className="flex flex-col md:hidden">
        <Typography
          variant="label"
          className="text-[13px]! font-bold! tracking-wider text-neutral-900 uppercase pb-6"
        >
          ESCROW TIMELINE
        </Typography>

        <div className="flex flex-col pl-1">
          {mobileSteps.map((step, index) => {
            const isLast = index === mobileSteps.length - 1;
            const nextStep = !isLast ? mobileSteps[index + 1] : null;
            const lineToNextIsRed = nextStep?.isDispute;

            return (
              <div
                key={step.id}
                className="relative flex items-start gap-4 pb-6 last:pb-2"
              >
                <div className="relative flex flex-col items-center self-stretch">
                  <div
                    className={clsx(
                      "w-3 h-3 rounded-full shrink-0 z-10 mt-1",
                      step.isDispute
                        ? "bg-red-600 ring-2 ring-red-100"
                        : step.isCompleted
                        ? "bg-emerald-600"
                        : step.isActive
                        ? "bg-amber-500 ring-3 ring-amber-100"
                        : "border-2 border-neutral-300 bg-white"
                    )}
                  />

                  {!isLast && (
                    <div
                      className={clsx(
                        "w-[2px] absolute top-4 bottom-[-4px]",
                        lineToNextIsRed
                          ? "bg-red-500"
                          : step.isCompleted
                          ? "bg-emerald-600"
                          : "border-l-2 border-dashed border-neutral-300"
                      )}
                    />
                  )}

                  {step.isDispute && (
                    <div className="w-[2px] absolute top-4 h-8 bg-red-500" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span
                    className={clsx(
                      "text-sm font-semibold leading-snug",
                      step.isDispute
                        ? "text-red-600"
                        : step.isCompleted || step.isActive
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    )}
                  >
                    {step.name}
                  </span>

                  {step.date && (
                    <span className="text-xs text-neutral-400 font-mono tracking-tight mt-0.5">
                      {step.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
