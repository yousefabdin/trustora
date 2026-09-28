import Typography from "@/components/atoms/typography/typography";
import DropDown from "@/components/molecules/inputs/DropDown";
import { useState } from "react";

const days = [
  { code: "7 days", name: "Last 7 Days" },
  { code: "30 days", name: "Last 30 Days" },
  { code: "90 days", name: "Last 90 Days" },
];
export default function DashboardHeader() {
  const [filterDays, setDays] = useState();
  return (
    <div className="hidden md:flex flex-col gap-[32px] px-[90px] pt-[48px] pb-4">
      <div className="w-full flex justify-between gap-20">
        <Typography
          variant={"h2"}
          children={"Dashboard"}
          className="text-[24px]! font-[600]! text-page-inverse"
        ></Typography>
        <div className="w-[150px]">
          <DropDown
            label={""}
            value={filterDays}
            options={days}
            defaultValue="Last 30 Days"
            onChange={() => setDays(filterDays)}
          ></DropDown>
        </div>
      </div>
    </div>
  );
}
