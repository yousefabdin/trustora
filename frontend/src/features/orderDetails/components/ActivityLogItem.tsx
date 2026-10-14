import Typography from "@/components/atoms/typography/typography";
import clsx from "clsx";
import { formatActivityDate } from "@/utils/dateUtils";
interface ActivityLogItemProps {
  status: {
    title?: string;
    description?: string;
    date: string;
    status?: string;
  };
  index: number;
  last: number;
}

export default function ActivityLogItem({ status, index, last }: ActivityLogItemProps) {
  return (
    <>
      <div className="flex items-start relative">
        <span
          className={clsx(
            "hidden md:block w-[8px] h-[8px] rounded-full bg-content-tertiary absolute left-[-4px] top-[6px]",
            index + 1 === last && "bg-accent-default!",
          )}
        ></span>
        <div
          className={clsx(
            "hidden w-full border-l px-4 min-h-[56px] pb-4 border-outline-subtle md:flex flex-col",
            index === 0 && "border-0! min-h-[36px]! pb-2!",
          )}
        >
          <div className="hidden md:flex justify-between items-start gap-4">
            <div className="flex flex-col min-w-0 flex-1">
              <Typography
                variant={"caption"}
                className="text-[13px]! font-[500]! text-content-primary"
              >
                {status.title}
              </Typography>
              {status.description && (
                <Typography
                  variant={"caption"}
                  className="text-[12px]! text-content-tertiary break-words line-clamp-3 leading-snug pt-0.5"
                  title={status.description}
                >
                  {status.description}
                </Typography>
              )}
            </div>

            <Typography
              variant={"caption"}
              className="text-[11px]! text-content-tertiary text-nowrap shrink-0 pt-0.5 font-jetbrains"
            >
              {formatActivityDate(status.date)}
            </Typography>
          </div>
        </div>
      </div>
      <div className="w-full flex md:hidden justify-between items-start gap-3 py-1">
        <div className="flex flex-col min-w-0 flex-1">
          <Typography
            variant={"caption"}
            className="text-[12px]! font-[500]! text-content-secondary truncate"
          >
            {status.title}
          </Typography>
          {status.description && (
            <Typography
              variant={"caption"}
              className="text-[11px]! text-content-tertiary break-words line-clamp-2"
            >
              {status.description}
            </Typography>
          )}
        </div>
        <div className="shrink-0">
          <Typography
            variant={"caption"}
            className="text-[11px]! font-[500]! text-[#9C9C99] font-jetbrains! whitespace-nowrap"
          >
            {formatActivityDate(status.date)}
          </Typography>
        </div>
      </div>
    </>
  );
}
