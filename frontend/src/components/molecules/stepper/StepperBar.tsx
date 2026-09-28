import Typography from "@/components/atoms/typography/typography";
import clsx from "clsx";
import { formatActivityDate } from "@/utils/dateUtils";
interface statusDate {
  date: string;
  status: string;
  formatActivityDate: () => void;
}
interface StepperBarProps {
  currentStep: number;
  isDisputed: boolean;
  statusDate: statusDate[];
}
export default function StepperBar({
  currentStep = 3,
  isDisputed,
  statusDate = [],
}: StepperBarProps) {
  const steps = [
    { name: "Captured", date: statusDate, isDisputed },
    { name: "Held in Escrow", date: statusDate, isDisputed },
    { name: "shipped", date: statusDate, isDisputed },
    { name: "Delivered", date: statusDate, isDisputed },
    { name: "Funds Released", date: statusDate, isDisputed },
  ];

  return (
    <div className="w-full">
      <div className="hidden w-full md:flex">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const historyItem = statusDate.find(
            (status) =>
              status.status.toLowerCase() === step.name.toLowerCase() &&
              stepNumber <= currentStep,
          );
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isLastStep = index === steps.length - 1;

          return (
            <div
              key={step.name}
              className="relative flex flex-1 flex-col items-center"
            >
              <div
                className={clsx(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-full",

                  isCompleted &&
                    "border-0 bg-success-icon text-content-inverse",

                  isActive &&
                    "border-[3px] border-amber-500 bg-surface-default",

                  !isCompleted &&
                    !isActive &&
                    "border-[3px] border-outline-strong bg-surface-default",

                  step.isDisputed && "!border-[3px] !border-red-500",
                )}
              >
                {isCompleted && <span className="text-sm font-bold">✓</span>}

                {step.isDisputed && (
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                )}

                {isActive && !step.isDisputed && (
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                )}
              </div>

              {!isLastStep && (
                <div
                  className={clsx(
                    "absolute left-1/2 right-[-50%] top-3 h-[2px] -translate-y-1/2",

                    step.isDisputed
                      ? "bg-red-500"
                      : index + 1 < currentStep && !isDisputed
                        ? "bg-success-icon"
                        : "border-t-2 border-dashed border-outline-default",
                  )}
                />
              )}

              <div className="mt-2 text-center">
                <span
                  className={clsx(
                    "text-sm",
                    isActive
                      ? "font-semibold text-content-primary"
                      : isCompleted
                        ? "text-content-secondary"
                        : "text-content-tertiary",
                  )}
                >
                  {stepNumber}. {step.isDisputed ? "Disputed" : step.name}
                </span>

                <span
                  className={clsx(
                    "block text-sm",
                    isActive
                      ? "font-semibold text-content-primary"
                      : isCompleted
                        ? "text-content-secondary"
                        : "text-content-tertiary",
                  )}
                >
                  {historyItem && formatActivityDate(historyItem?.date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col  md:hidden p-[12px] gap-[12px]">
        <Typography variant={"label"} className="text-[15px] font-bold! pb-4">
          Escrow Timeline
        </Typography>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const historyItem = statusDate.find(
            (item) => item.status.toLowerCase() === step.name.toLowerCase(),
          );
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isLastStep = index === steps.length - 1;

          return (
            <div key={step.name} className="flex">
              <div className="flex w-6 shrink-0 flex-col items-center">
                <div
                  className={clsx(
                    "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",

                    isCompleted &&
                      "border-0 bg-success-icon text-content-inverse",

                    isActive &&
                      "border-[3px] border-amber-500 bg-surface-default",

                    !isCompleted &&
                      !isActive &&
                      "border-[3px] border-outline-strong bg-surface-default",

                    step.isDisputed && "!border-[3px] !border-red-500",
                  )}
                >
                  {isCompleted && <span className="text-sm font-bold">✓</span>}

                  {step.isDisputed && (
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  )}

                  {isActive && !step.isDisputed && (
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </div>

                {!isLastStep && (
                  <div
                    className={clsx(
                      "h-16 w-[2px]",

                      step.isDisputed
                        ? "bg-red-500"
                        : index + 1 < currentStep && !isDisputed
                          ? "bg-success-icon"
                          : "border-l-2 border-dashed border-outline-default",
                    )}
                  />
                )}
              </div>

              <div className="ml-4 pb-6">
                <span
                  className={clsx(
                    "text-sm",
                    isActive
                      ? "font-semibold text-content-primary"
                      : isCompleted
                        ? "text-content-secondary"
                        : "text-content-tertiary",
                  )}
                >
                  {stepNumber}. {step.isDisputed ? "Disputed" : step.name}
                </span>

                <span
                  className={clsx(
                    "block text-sm",
                    isActive
                      ? "font-semibold text-content-primary"
                      : isCompleted
                        ? "text-content-secondary"
                        : "text-content-tertiary",
                  )}
                >
                  {historyItem
                    ? new Date(historyItem.date).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
