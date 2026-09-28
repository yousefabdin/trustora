import { Icon } from "@iconify/react";
import Button from "../atoms/Button/Button";
import { Link } from "react-router";
interface EmptyStateProps {
  placeholder: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  img?: string;
}
export default function EmptyState({
  placeholder,
  description,
  buttonLabel,
  buttonLink,
  img,
}: EmptyStateProps) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-[32px]  rounded-xl border-1 border-outline-subtle bg-page-secondary p-[80px]  ">
      {img && (
        <div className="flex items-center justify-center w-[120px] h-[120px] border-page-tertiary rounded-[50%] bg-page-tertiary">
          <img src="/assest/images/noOrderYet.png" alt="" />
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-2 w-[480px]">
        <div className="font-medium text-[20px] text-content-primary">
          {placeholder}
        </div>
        <span className="font-normal text-content-secondary text-[14px] text-center">
          {description}
        </span>
        <span className="p-[10px]">
          <Link to={buttonLink}>
            <Button
              variant="primary"
              className="py-2 rounded-[6px]! px-[20px] py-[12px] "
            >
              <Icon icon="akar-icons:arrow-cycle" className="mr-2"></Icon>
              {buttonLabel}
            </Button>
          </Link>
        </span>
      </div>
    </div>
  );
}
