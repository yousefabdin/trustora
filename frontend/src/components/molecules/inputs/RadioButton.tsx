import { Icon } from "@iconify/react";
import { clsx } from "clsx";
import { useState } from "react";

interface CheckBoxProps {
  radioButtonLabel: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}
export default function RadioButton({
  radioButtonLabel,
  name,
  value,
  checked,
  onChange,
  disabled = false,
}: CheckBoxProps) {
  return (
    <div
      className={clsx(
        "flex gap-2 items-center",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
      onClick={() => {
        if (!disabled) onChange();
      }}
    >
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => {
            if (!disabled) onChange();
          }}
          className={clsx(
            "w-[20px] h-[20px] appearance-none bg-surface-default border-outline-default border-1 rounded-[50%]",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            checked && " border-accent-default!",
          )}
        />
        {checked && (
          <div className="absolute w-[10px] h-[10px] bottom-[10px] left-[5px] rounded-full bg-accent-default"></div>
        )}
      </div>
      <label
        className={clsx(
          "font-inter font-[400] text-[14px] text-content-secondary mb-1",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          checked && " text-[14px] text-page-inverse font-[500]!",
        )}
      >
        {radioButtonLabel}
      </label>
    </div>
  );
}
