import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { useState } from "react";

interface CheckBoxProps {
  toggleLabel: string;
}

export default function ToggleSwitch({ toggleLabel }: CheckBoxProps) {
  const [isChecked, setIsChecked] = useState(false);
  console.log(isChecked);

  return (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={() => setIsChecked(!isChecked)}
    >
      <div className="relative">
        <input
          type="checkbox"
          className={clsx(
            "w-[44px] h-[24px] appearance-none bg-outline-default border-outline-default border-1 rounded-[12px] p-[2px]  transition-all duration-300",
            isChecked && "bg-accent-default! border-0! ",
          )}
        />
        <span
          className={clsx(
            " absolute top-0.75 left-0.5 bg-surface-default w-[20px] h-[20px] rounded-full  transition-all duration-200",
            isChecked && " translate-x-[20px]",
          )}
        ></span>
      </div>
      <label
        className={clsx(
          "font-inter font-normal text-[14px] text-content-secondary mb-1 ",
          isChecked && " text-[14px] text-content-primary",
        )}
      >
        {toggleLabel}
      </label>
    </div>
  );
}
