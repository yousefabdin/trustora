import Typography from "@/components/atoms/typography/typography";
import clsx from "clsx";
import { formatActivityDate } from "@/utils/dateUtils";
export default function ActivityLogItem({ status, index, last }) {
  console.log(index);
  return (
    <>
      <div className="flex items-start relative">
        <span
          className={clsx(
            "hidden md:block w-[8px] h-[8px] rounded-full bg-content-tertiary absolute left-[-4px] ",
            index + 1 === last && "bg-accent-default!",
          )}
        ></span>
        <div
          className={clsx(
            "hidden w-full border-l px-4 h-20 border-outline-subtle md:flex flex-col",
            index === 0 && "border-0! h-10!",
          )}
        >
          <div className="hidden md:flex justify-between items-start ">
            <div className="flex flex-col ">
              <Typography
                variant={"caption"}
                className="text-[13px]! font-[500]!"
              >
                {status.title}
              </Typography>
              <Typography
                variant={"caption"}
                className="text-[12px]! text-content-tertiary "
              >
                {status.description}
              </Typography>
            </div>

            <Typography
              variant={"caption"}
              className="text-[11px]! text-content-tertiary text-nowrap"
            >
              {formatActivityDate(status.date)}
            </Typography>
          </div>
        </div>
      </div>
      <div className="w-full flex md:hidden justify-between ">
        <div>
          <Typography
            variant={"caption"}
            className="text-[12px]! font-[400]! text-content-secondary text-nowrap"
          >
            {status.title}
          </Typography>
        </div>
        <div>
          <Typography
            variant={"caption"}
            className=" text-[12px]! font-[500]! text-[#9C9C99] font-jetbrains!"
          >
            {formatActivityDate(status.date)}
          </Typography>
        </div>
      </div>
    </>
  );
}
