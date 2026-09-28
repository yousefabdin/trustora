import { Icon } from "@iconify/react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import {
  getPasswordRequirements,
  getPasswordStrength,
} from "@/utils/passwordUtils";

interface TextFieldProps {
  disabled?: boolean;
  type: "password" | "email" | "text" | "number" | "confirmPassword";
  placeholder: string;
  helper?: string;
  label: string;
  required: boolean;
  className?: string;
  confirmation: boolean;

  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  password?: string;

  setPasswordStrength?: (strength: string) => void;
  setPassedRules?: (count: number) => void;
  setPassword?: (password: string) => void;
}

export default function TextFieldInput({
  disabled,
  type,
  placeholder,
  helper,
  label,
  required,
  className,
  confirmation,
  value,
  onChange,
  password,
  setPasswordStrength,
  setPassedRules,
  setPassword,
}: TextFieldProps) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const errorIcon = (
    <Icon
      icon="material-symbols:error-outline"
      color="var(--danger-icon)"
      className="h-[11.67px] w-[11.67px] text-danger-icon"
    />
  );

  const passwordEyeIcon = (
    <Icon
      className="h-[18px] w-[18px] text-content-tertiary"
      icon="weui:eyes-on-outlined"
    />
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const input = e.target;

    onChange(e);

    if (inputValue === "") {
      setError("");
      input.setCustomValidity("");

      setPassedRules?.(0);
      setPasswordStrength?.("weak");
      setPassword?.("");

      return;
    }

    if (type === "email") {
      if (/^[a-zA-Z0-9@._-]*$/.test(inputValue)) {
        setError("");
        input.setCustomValidity("");
      } else {
        setError("Invalid Email Address");
        input.setCustomValidity("Invalid Characters");
      }

      return;
    }

    if (type === "password" || type === "confirmPassword") {
      if (confirmation || type === "confirmPassword") {
        if (inputValue !== password) {
          setError("Passwords are not Matching");
          input.setCustomValidity("Passwords Must Be Confirmed");
        } else {
          setError("");
          input.setCustomValidity("");
        }

        return;
      }

      const strength = getPasswordStrength(inputValue);
      setPasswordStrength?.(strength);

      const requirements = getPasswordRequirements(inputValue);

      const passedRules = Object.values(requirements).filter(Boolean).length;

      setPassedRules?.(passedRules);

      setPassword?.(inputValue);

      if (inputValue.length < 8) {
        setError("Password should be more than 8 characters");
        input.setCustomValidity("Password should be more than 8 characters");
      } else {
        setError("");
        input.setCustomValidity("");
      }

      return;
    }

    if (type === "text") {
      if (/^[a-zA-Z0-9@\s]*$/.test(inputValue)) {
        setError("");
        input.setCustomValidity("");
      } else {
        setError("Invalid Characters");
        input.setCustomValidity("Invalid Characters");
      }

      return;
    }

    if (type === "number") {
      if (/^[0-9\s]*$/.test(inputValue)) {
        setError("");
        input.setCustomValidity("");
      } else {
        setError("Numbers only");
        input.setCustomValidity("Numbers only");
      }

      return;
    }
  };

  const handleClickIcon = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col">
      {label && (
        <label className="font-inter text-[12px] font-medium py-1 text-content-primary">
          {label}
        </label>
      )}

      <TextField
        placeholder={placeholder}
        id="standard-error-helper-text"
        disabled={disabled}
        className={className}
        error={!!error}
        helperText={
          error ? (
            <span className="flex items-center gap-1 text-[12px] leading-[18px] text-danger-icon">
              {errorIcon}
              {error}
            </span>
          ) : null
        }
        type={
          (type === "password" || type === "confirmPassword") && !showPassword
            ? "password"
            : "text"
        }
        required={required}
        value={value}
        onChange={handleChange}
        sx={{
          width: "full",
          text: "text-content-primary",

          "& .MuiInputBase-input": {
            fontSize: "14px",
            fontWeight: "400",
            fontFamily: "inter",
            color: "var(--content-primary)",
          },

          "& .MuiOutlinedInput-root": {
            height: "36px",
            borderRadius: "6px",
            paddingRight: "0px",

            "& fieldset": {
              border: "1px solid var(--outline-strong)",
            },

            "&.Mui-error fieldset": {
              border: "2px solid var(--danger-icon)",
            },

            "&.Mui-error.Mui-focused fieldset": {
              border: "2px solid var(--danger-icon)",
              boxShadow: "0px 0px 4px 0px var(--red-100)",
            },

            "&:focus-within fieldset": {
              border: "2px solid var(--outline-focus)",
            },

            "&:focus-within": {
              boxShadow: "0px 0px 4px 0px var(--accent-subtle)",
            },
          },

          "& .MuiOutlinedInput-input": {
            height: "0px",
            paddingLeft: "12px",
            paddingRight: "0px",
            backgroundColor: "var(--surface-default)",
          },

          "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-input": {
            backgroundColor: "var(--danger-surface)",
          },

          "& .MuiFormHelperText-root": {
            marginLeft: 0,
            marginRight: 0,
          },

          "& .MuiOutlinedInput-root.Mui-disabled": {
            backgroundColor: "var(--page-tertiary)",

            "& fieldset": {
              border: "1px solid var(--outline-default)",
            },
          },

          "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-input": {
            backgroundColor: "var(--page-tertiary)",
            color: "var(--content-tertiary)",
            WebkitTextFillColor: "var(--content-tertiary)",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0%",
          },
        }}
        slotProps={{
          input: {
            endAdornment: (type === "password" ||
              type === "confirmPassword") && (
              <button
                type="button"
                onClick={handleClickIcon}
                className={
                  error
                    ? "flex-1 flex-row bg-danger-surface h-full items-end"
                    : ""
                }
              >
                <InputAdornment
                  position="end"
                  sx={{ marginRight: "12px" }}
                  className="cursor-pointer"
                >
                  {passwordEyeIcon}
                </InputAdornment>
              </button>
            ),
          },
        }}
      />

      {helper && (
        <span className="text-content-tertiary flex h-[15px] items-center font-[Inter] text-[12px] font-semibold leading-[100%] tracking-[0%] mt-1">
          {helper}
        </span>
      )}
    </div>
  );
}
