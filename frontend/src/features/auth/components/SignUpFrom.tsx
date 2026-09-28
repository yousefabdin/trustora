import Typography from "@/components/atoms/typography/typography";
import TextField from "@/components/molecules/inputs/TextField";
import { useState } from "react";
import clsx from "clsx";
import { getPasswordStrength } from "@/utils/passwordUtils";
import Button from "@/components/atoms/Button/Button";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/molecules/toast/Toast";
export default function SignUpForm() {
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [passedRules, setPassedRules] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await register({
        password,
        email,
        name,
      });
      console.log(user);
      if (user.role === "user") navigate("/browse");
      if (user.role === "seller") navigate("/seller/dashboard");
      if (user.role === "admin") navigate("/admin/dashboard");
    } catch (error) {
      showToast({
        variant: "error",
        message: "Password or Email is wrong please try again",
      });
    }
  };
  return (
    <div className="flex items-center justify-center p-[20px] md:p-[80px] w-full md:w-[50%] ">
      <div className="flex justify-center items-center gap-[32px] w-full">
        <div className="flex flex-col items-center w-full md:w-[400px] gap-[12px]">
          <div className="flex md:hidden items-center justify-center gap-3 w-full mb-8">
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
          <div className="flex flex-col items-center md:items-start w-full  ">
            <Typography
              variant={"h2"}
              children={"Create your account"}
              className="text-[24px]! font-[700]!"
            ></Typography>
            <Typography
              variant={"h2"}
              children={"Join Holdline as a buyer, seller, or broker."}
              className="hidden md:block text-[14px]! font-[400]! text-content-secondary"
            ></Typography>
            <Typography
              variant={"h2"}
              children={"Secure transactions in minutes"}
              className="block md:hidden text-[14px]! font-[400]! text-content-secondary"
            ></Typography>
          </div>
          <div className="w-full">
            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-[16px] "
            >
              <div className="flex flex-col gap-[12px] ">
                <div>
                  <label
                    htmlFor=""
                    className="text-page-inverse text-[13px] font-[600]"
                  >
                    Full Name
                  </label>
                  <TextField
                    type={"text"}
                    placeholder={"Jane Doe"}
                    label=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={true}
                  ></TextField>
                </div>
                <div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required={true}
                  ></TextField>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-page-inverse text-[13px] font-[600]"
                  >
                    Password
                  </label>
                  <TextField
                    type={"password"}
                    placeholder={"••••••••••••"}
                    label=""
                    required={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    setPasswordStrength={setPasswordStrength}
                    setPassedRules={setPassedRules}
                    setPassword={setPassword}
                  ></TextField>
                  <div className="hidden md:block">
                    <div className="flex justify-between items-center pt-2">
                      <Typography
                        variant={"h2"}
                        children={"Password strength"}
                        className="text-[11px]! font-[600]! text-content-secondary"
                      ></Typography>
                      <Typography
                        variant={"h2"}
                        children={passwordStrength}
                        className={clsx(
                          "text-[11px]! font-[Bold]! text-content-secondary font-jetbrains",
                          passwordStrength === "weak" && " text-danger-icon",
                          passwordStrength === "medium" && " text-escrow-icon",
                          passwordStrength === "strong" &&
                            " text-success-outline",
                          passwordStrength === "Very Strong" &&
                            " text-success-foreground",
                        )}
                      ></Typography>
                    </div>
                    <div className="flex justify-between">
                      <div
                        className={clsx(
                          "border w-[97px] h-[4px] rounded-[2px] bg-page-tertiary border-page-tertiary",
                          passedRules === 0 &&
                            "bg-danger-icon! border-danger-icon",
                          passedRules > 1 && "bg-[#10B981]! !border-[#10B981]",
                        )}
                      ></div>
                      <div
                        className={clsx(
                          "border w-[97px] h-[4px] rounded-[2px] bg-page-tertiary border-page-tertiary",
                          passedRules >= 3 && "bg-[#10B981]! !border-[#10B981]",
                        )}
                      ></div>
                      <div
                        className={clsx(
                          "border w-[97px] h-[4px] rounded-[2px] bg-page-tertiary border-page-tertiary",
                          passedRules >= 4 && "bg-[#10B981]! !border-[#10B981]",
                        )}
                      ></div>
                      <div
                        className={clsx(
                          "border w-[97px] h-[4px] rounded-[2px] bg-page-tertiary border-page-tertiary",
                          passedRules >= 5 && "bg-[#10B981]! !border-[#10B981]",
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-page-inverse text-[13px] font-[600]"
                  >
                    Confirm Password
                  </label>
                  <TextField
                    type={"password"}
                    placeholder={"••••••••••••"}
                    label=""
                    required={true}
                    confirmation={true}
                    password={password}
                  ></TextField>
                </div>
              </div>
              <Button
                variant="primary"
                children={"Create Account"}
                className="rounded-[6px]! text-[14px] font-[600] text-page-primary px-[16px] py-[12px]"
              ></Button>
            </form>
          </div>
          <div className="flex  justify-between w-full gap-2">
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
              className="w-full flex items-center gap-2 text-[14px]! font-[600] px-[16px] text-page-inverse border rounded-[6px]! border-page-tertiary"
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
            onClick={() => navigate("/login")}
          >
            <Typography
              variant={"h2"}
              children={"Already have an account?"}
              className="text-[14px]! font-[400]! text-content-secondary"
            ></Typography>
            <Typography
              variant={"h2"}
              children={"Sign in"}
              className="text-[13px]! font-[600]! text-accent-default"
            ></Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
