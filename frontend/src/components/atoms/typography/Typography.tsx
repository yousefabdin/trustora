import { clsx } from "clsx";

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "caption"
  | "label"
  | "currencyLarge"
  | "currencySmall";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  onClick?: () => void;
}

const typographyStyles: Record<TypographyVariant, string> = {
  display: "font-inter text-[56px] leading-[56px] font-extraBold",

  h1: "font-inter text-[36px] leading-[40px] font-extraBold",

  h2: "font-inter text-[24px] leading-[32px] font-semibold",

  h3: "font-inter text-[20px] leading-[28px] font-medium",

  bodyLarge: "font-inter text-[16px] leading-[24px] font-normal",

  body: "font-inter text-[14px] leading-[20px] font-normal",

  bodySmall: "font-inter text-[13px] leading-[18px] font-normal",

  caption: "font-inter text-[12px] leading-[16px] font-normal",

  label: "font-inter text-[12px] leading-[16px] font-medium",

  currencyLarge: "font-jetbrains text-[28px] leading-[36px] font-medium",

  currencySmall: "font-jetbrains text-[14px] leading-[20px] font-normal",
};

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  bodyLarge: "p",
  body: "p",
  bodySmall: "p",
  caption: "span",
  label: "span",
  currencyLarge: "span",
  currencySmall: "span",
};

export default function Typography({
  variant,
  children,
  className,
  as,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={clsx(typographyStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
