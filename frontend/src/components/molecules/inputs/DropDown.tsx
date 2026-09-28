import { MenuItem, TextField } from "@mui/material";
import { countries } from "@/utils/CountryData";

interface DropDownProps {
  disabled?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: { code: string; name: string }[];
  placeholder?: string;
  defaultValue?: string;
}

export default function DropDown({
  disabled = false,
  label,
  value,
  onChange,
  options = countries,
  placeholder = "Select...",
  defaultValue,
}: DropDownProps) {
  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className="font-inter text-[12px] font-medium py-1 text-content-primary">
          {label}
        </label>
      )}

      <TextField
        select
        value={value}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          select: {
            displayEmpty: true,

            MenuProps: {
              variant: "menu",

              slotProps: {
                paper: {
                  sx: {
                    maxHeight: "140px",
                    overflowY: "auto",
                    marginTop: "4px",
                    border: "1px solid var(--outline-default)",
                    borderRadius: "8px",
                  },
                },
              },
            },

            renderValue: (selected) => {
              if (!selected) {
                return (
                  <span className="text-content-tertiary">{placeholder}</span>
                );
              }

              const selectedOption = options.find(
                (option) =>
                  option.code.toLowerCase() === selected.toLowerCase() ||
                  option.name.toLowerCase() === selected.toLowerCase(),
              );

              return selectedOption?.name ?? selected;
            },
          },
        }}
        sx={{
          width: "100%",

          "& .MuiOutlinedInput-root": {
            width: "100%",
            height: "36px",
            paddingLeft: "12px",
            paddingRight: "12px",
            borderRadius: "6px",
            backgroundColor: "var(--surface-default)",
            boxSizing: "border-box",

            "& fieldset": {
              border: "1px solid var(--outline-default)",
            },

            "&:hover fieldset": {
              border: "1px solid var(--outline-default)",
            },

            "&.Mui-focused fieldset": {
              border: "1px solid var(--outline-focus)",
            },
          },

          "& .MuiOutlinedInput-root.Mui-disabled": {
            backgroundColor: "var(--page-tertiary)",

            "& fieldset": {
              border: "1px solid var(--outline-default)",
            },
          },

          "& .MuiSelect-select": {
            color: "var(--content-primary)",
            display: "flex",
            alignItems: "center",
            padding: "0 !important",
            fontFamily: "Inter",
            fontWeight: 400,
            fontSize: "14px",
            height: "36px",
            boxSizing: "border-box",
          },

          "& .MuiSelect-icon": {
            right: "12px",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.code}
            value={option.code}
            className="
              !text-content-secondary
              !text-[14px]
              !font-normal
              hover:border!
              hover:rounded-lg!
              hover:border-accent-subtle!
              hover:bg-accent-subtle!
              hover:text-accent-default!
              hover:font-[500]!
            "
          >
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
