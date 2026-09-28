import clsx from "clsx";
import { useRef, useState } from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  maxLength?: number;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  className,
  label,
  name,
  value,
  onChange,
  rows = 3,
  required = false,
  helperText,
  maxLength = 110,
  placeholder = "",
  ...props
}: TextAreaProps) {
  const [error, setError] = useState("");

  const [height, setHeight] = useState(120);

  const start = useRef({
    mouseY: 0,
    height: 120,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    onChange(e);

    if (inputValue === "") {
      setError("TextArea Can't Be Empty");
      return;
    }

    if (inputValue.length >= maxLength) {
      setError(`Maximum ${maxLength} characters allowed`);
      return;
    }

    setError("");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    start.current = {
      mouseY: e.clientY,
      height,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight =
        start.current.height + (e.clientY - start.current.mouseY);

      setHeight(Math.max(80, newHeight));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex w-full flex-col gap-y-2">
      <label htmlFor={props.id} className="block">
        {required && <span className="font-bold">*</span>}
        {label}
      </label>

      <div
        className="relative w-full"
        style={{
          height,
        }}
      >
        <textarea
          {...props}
          id={props.id}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          maxLength={maxLength}
          style={{
            height,
          }}
          className={clsx(
            className,
            "w-full resize-none outline-none rounded-md p-2 text-sm",
            error
              ? "bg-danger-surface border border-red-500"
              : "border border-outline-default",
          )}
        />

        <div className="absolute bottom-1 right-1 z-10 cursor-se-resize">
          <img
            onMouseDown={handleMouseDown}
            src={
              error
                ? "/assets/icons/TextAreaErrorIcon.png"
                : "/assest/icons/TextAreaIcon.png"
            }
            alt=""
            className="h-[8px] w-[8px]"
          />
        </div>
      </div>

      {error && (
        <span className="flex items-center gap-1 text-danger-icon leading-3 font-medium text-[12px]">
          <img
            src="/assest/icons/Vector.png"
            alt="error"
            className="h-[11.67px] w-[11.67px]"
          />
          {error}
        </span>
      )}

      {helperText && <span className="text-xs">Note: {helperText}</span>}
    </div>
  );
}
