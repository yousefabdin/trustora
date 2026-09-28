import Typography from "@/components/atoms/typography/Typography";
import Button from "@/components/atoms/Button/Button";

interface HeroAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

interface HeroSectionProps {
  badge?: React.ReactNode;
  title: string;
  description?: string;
  actions?: HeroAction[];
  visual?: React.ReactNode;
  className?: string;
}

export default function HeroSectionListing({
  badge,
  title,
  description,
  actions = [],
  visual,
  className = "",
}: HeroSectionProps) {
  return (
    <section className={`flex justify-center w-full bg-white  ${className}`}>
      <div className="flex flex-col sm:flex-row  min-h-[200px] w-full items-center justify-around px-2 py-9">
        <div className="flex flex-col gap-2 ">
          {badge && <div className="mb-3">{badge}</div>}

          <Typography
            variant="h1"
            className="max-w-[500px] text-[56px] font-[800]! leading-[115%] text-page-inverse"
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body"
              className="mb-20 sm:mb-10 lg:mb-10 max-w-[576px] max-h-[87px] text-[19px] text-content-tertiary font-[400] text-[18px] leading-[160%] py-4"
            >
              {description}
            </Typography>
          )}

          {actions.length > 0 && (
            <div className=" flex flex-col md:flex-row md:items-center items-start justify-start gap-2 ">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant={
                    action.variant === "secondary" ? "secondary" : "primary"
                  }
                  onClick={action.onClick}
                  className="whitespace-nowrap rounded-xl h-[46px] w-[138px] font-[600] "
                  size="large"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {visual && (
          <div className="hidden lg:flex font-[600] w-[480px] h-[360px] shrink-0 items-center justify-center  ">
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
