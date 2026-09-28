import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { useState } from "react";

interface CheckBoxProps {
  checkBoxLabel: string;
}
export default function CheckBox({ checkBoxLabel }: CheckBoxProps) {
  const [isChecked, setIsChecked] = useState(false);
  console.log(isChecked);

  return (
    <div
      className="flex gap-2 items-center justify-cenitter "
      onClick={() => setIsChecked(!isChecked)}
    >
      <div className="relative">
        <input
          type="checkbox"
          className={clsx(
            "w-[20px] h-[20px] appearance-none bg-surface-default border-outline-default border-1 rounded-sm",
            isChecked && "bg-accent-default! border-0!",
          )}
        />
        {isChecked && (
          <Icon
            icon="mdi:success"
            className="w-[12px] h-[20px] absolute top-0 left-[4px] text-content-inverse stroke-2 stroke-content-inverse"
          ></Icon>
        )}
      </div>
      <label
        className={clsx(
          "font-inter font-[400] text-[14px] text-content-secondary mb-1 ",
          isChecked && "font-[500] text-[14px] text-content-primary",
        )}
      >
        {checkBoxLabel}
      </label>
    </div>
  );
}
