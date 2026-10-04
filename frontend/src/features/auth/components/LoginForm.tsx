import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import TextField from "@/components/molecules/inputs/TextField";
import { useState } from "react";
import { useNavigate } from "react-router";
import ForgotPasswordModal from "./ForgotPasswordModal";

import { useAuth } from "@/context/AuthContext";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });

      if (user.role === "user") navigate("/myorders");
      if (user.role === "seller") navigate("/seller/dashboard");
      if (user.role === "admin") navigate("/admin/dashboard");
    } catch (error) {
      return null;
    }
  };
  return (
    <>
      <div className="flex justify-center items-center gap-[32px] p-[24px] md:p-[80px] h-full  md:h-screen w-full md:w-[50%] ">
        <div className="flex flex-col items-center w-full md:w-[400px] gap-[32px]">
          <div className="flex md:hidden items-center justify-center gap-3 w-full">
            <div className="flex items-center bg-accent-default rounded-[6px] w-[28px] h-[28px] ">
              <img
                src="assets/images/trustoraLogoLight.png"
                alt=""
                className="w-[32px] h-[32px]"
              />
            </div>
            <Typography
              variant={"label"}
              children={"Trustora"}
              className="text-[18px] font-[700]! text-page-inverse"
            ></Typography>
            <Typography
              variant={"label"}
              children={"ESCROW"}
              className="text-[10px]! font-[700]! text-accent-default font-jetbrains bg-page-tertiary px-[3px]  rounded-[4px]"
            ></Typography>
          </div>
          <div className="flex flex-col items-center md:items-start gap-[8px] w-full  ">
            <Typography
              variant={"h2"}
              children={"Welcome back"}
              className="text-[24px]! font-[700]!"
            ></Typography>
            <Typography
              variant={"h2"}
              children={"Securely sign in to manage your escrow accounts."}
              className="hidden md:block text-[14px]! font-[400]! text-content-secondary"
            ></Typography>
            <Typography
              variant={"h2"}
              children={"Sign in to secure escrow accounts"}
              className="block md:hidden text-[14px]! font-[400]! text-content-secondary"
            ></Typography>
          </div>
          <div className="w-full">
            <form
              action=""
              className="flex flex-col gap-[20px]"
              id="login-form"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor=""
                  className="text-page-inverse text-[13px] font-[600]"
                >
                  Email address
                </label>
                <TextField
                  type={"email"}
                  placeholder={"you@example.com"}
                  label=""
                  required={true}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></TextField>
              </div>
              <div>
                <div className="flex justify-between">
                  <label
                    htmlFor=""
                    className="text-page-inverse text-[13px] font-[600] mt-1"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[13px] font-[500] text-accent-default hover:underline"
                  >
                    Forget Password?
                  </button>
                </div>
                <TextField
                  type={"password"}
                  placeholder={"••••••••••••"}
                  label=""
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
              </div>
              <Button
                children={"Sign In"}
                variant="primary"
                size="large"
                className="text-[14px]! font-semiBold px-[16px] rounded-[6px]!"
                type="submit"
                form="login-form"
              ></Button>
            </form>
          </div>
          <div className="flex item justify-between w-full gap-2">
            <div className="border-t border-page-tertiary w-full mt-4"></div>
            <Typography
              variant={"h2"}
              children={"OR"}
              className="text-[12px]! font-[500]! text-[#9C9C99]"
            ></Typography>
            <div className="border-t border-page-tertiary w-full mt-4"></div>
          </div>
          <div className="w-full">
            <Button
              variant="ghost"
              size="large"
              className="w-full flex items-center gap-2 text-[14px]! font-[600] py-6 px-[16px] text-page-inverse border rounded-[6px]! border-page-tertiary"
            >
              <img
                src="assets/icons/Vector.png"
                alt=""
                className="w-[15px] h-[15px] mt-0.5"
              />
              Continue with Google
            </Button>
          </div>
          <div
            className="flex gap-1 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            <Typography
              variant={"h2"}
              children={"Don't have an account?"}
              className="text-[14px]! font-[400]! text-content-secondary"
            ></Typography>
            <Typography
              variant={"h2"}
              children={"Sign Up"}
              className="text-[13px]! font-[600]! text-accent-default"
            ></Typography>
          </div>
          <div className="block md:hidden w-full bg-[#EBEBE9] h-full rounded-[8px] border-page-tertiary">
            <div className="flex items-start  p-[12px] gap-[12px]">
              <img
                src="assets/images/trustoraLogo.png"
                alt=""
                className="w-[25px] h-[25px]"
              />
              <div className="flex flex-col gap-1">
                <Typography
                  variant={"caption"}
                  children={"Secured by Holdline Protocol"}
                  className="text-[12px]! font-[600]! text-page-inverse"
                ></Typography>
                <Typography
                  variant={"caption"}
                  children={"Sign in to secure escrow accounts"}
                  className="text-[11px]! font-[400]! text-content-secondary"
                ></Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
      )}
    </>
  );
}
