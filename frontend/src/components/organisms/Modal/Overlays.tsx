import { Link } from "react-router";
import Button from "../../atoms/Button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header: string;
  btn1Text: string;
  btn2Text: string;
  setIsOpen: (isOpen) => void;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  header,
  btn1Text,
  btn2Text,
  setIsOpen,
}: ModalProps) {
  console.log("inside");

  if (!isOpen) return null;

  return (
    <div className="h-full">
      <div className="h-full fixed inset-0 z-50 flex items-center justify-center bg-content-primary/50">
        {children}
        {/* <div> 
            <h1 className="font-inter font-medium text-[20px] pt-2 px-2 ">
              {header}
            </h1>
            <p className="text-[14px] text-content-secondary p-2 m-1">
              {" "}
              {children}
            </p>
          </div>
          <div className="flex justify-end items-end mx-2 my-2 gap-2">
            <Link to="/">
              <Button
                variant="ghost"
                size="large"
                className="text-accent-default border border-accent-default"
                onClick={onClose}
              >
                {btn1Text}
              </Button>
            </Link>
            <Link to="/">
              <Button size="large" onClick={onClose}>
                {btn2Text}
              </Button>
            </Link>
          </div> */}
      </div>
    </div>
  );
}
