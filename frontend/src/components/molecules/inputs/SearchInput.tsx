import { Icon } from "@iconify/react";
import { useState } from "react";
import clsx from "clsx";

interface SearchInputProps {
  value?: string;
  setSearch?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function SearchInput({
  value,
  setSearch,
  className,
  placeholder,
}: SearchInputProps) {
  const [internalText, setInternalText] = useState("");
  const isControlled = value !== undefined;
  const text = isControlled ? value : internalText;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalText(e.target.value);
    }
    setSearch?.(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full relative flex items-center">
      <form onSubmit={handleSubmit} action="" className="w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <Icon
            icon="basil:search-solid"
            className="w-[20px] h-[20px] top-1/2 -translate-y-1/2 left-3 absolute text-[#9C9C99] pointer-events-none"
          />
          <input
            type="text"
            onChange={handleChange}
            value={text}
            placeholder={placeholder ?? "Search listings..."}
            className={clsx(
              "w-full md:w-[320px] lg:w-[400px] min-h-[44px] font-[400] text-content-primary placeholder:text-[14px] placeholder:text-content-tertiary border border-outline-subtle hover:border-outline-subtle focus:outline-none focus:border-outline-strong text-[14px] pl-10 pr-4 rounded-[6px] transition-colors",
              className,
            )}
          />
        </div>
      </form>
    </div>
  );
}
