import Typography from "@/components/atoms/typography/typography";
import ActivityLogItem from "./ActivityLogItem";

export interface OrderActivity {
  status: OrderStatus;
  date: string;
  description?: string;
}
export default function ActiviyLog({ order }) {
  const last = order.statusHistory.length;
  return (
    <div className="w-full max-w-[700px] min-w-[350px] h-full flex flex-col  md:bg-neutral-white w-full md:p-[24px] md:rounded-[12px] md:gap-[16px] ">
      <Typography
        variant={"h3"}
        children={"Activiy Log"}
        className="text-[11px]! text-[#9C9C99] md:text-[16px]! md:font-semibold md:text-page-inverse"
      ></Typography>
      <div className=" flex flex-col flex-col-reverse gap-1 md:gap-2 ">
        {order.statusHistory.map((status, index) => {
          return (
            <ActivityLogItem
              status={status}
              index={index}
              last={last}
            ></ActivityLogItem>
          );
        })}
      </div>
    </div>
  );
}
