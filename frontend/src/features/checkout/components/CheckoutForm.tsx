import Button from "@/components/atoms/button/Button";
import Typography from "@/components/atoms/typography/Typography";
import DropDown from "@/components/molecules/inputs/DropDown";
import TextField from "@/components/molecules/inputs/TextField";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface CheckoutFormProps {
  item?: {
    id?: number | string;
    itemName?: string;
    itemPrice?: number | string;
  };
  handleOrderPayment: (e?: React.FormEvent) => Promise<void> | void;
  isSubmitting?: boolean;
}

interface FormData {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expDate: string;
  cvc: string;
}

interface FormErrors {
  fullName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  cardNumber?: string;
  expDate?: string;
  cvc?: string;
}

export default function CheckoutForm({
  handleOrderPayment,
  isSubmitting = false,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    cardNumber: "",
    expDate: "",
    cvc: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};

    if (!data.fullName.trim()) {
      errs.fullName = "Full Name is required";
    } else if (data.fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    }

    if (!data.addressLine1.trim()) {
      errs.addressLine1 = "Street address is required";
    } else if (data.addressLine1.trim().length < 3) {
      errs.addressLine1 = "Please enter a valid street address";
    }

    if (!data.city.trim()) {
      errs.city = "City is required";
    }

    if (!data.state.trim()) {
      errs.state = "State is required";
    }

    const rawZip = data.zipCode.replace(/\D/g, "");
    if (!rawZip) {
      errs.zipCode = "ZIP code is required";
    } else if (rawZip.length !== 5) {
      errs.zipCode = "Must be 5 digits";
    }

    if (!data.country) {
      errs.country = "Country is required";
    }

    const rawCard = data.cardNumber.replace(/\D/g, "");
    if (!rawCard) {
      errs.cardNumber = "Card number is required";
    } else if (rawCard.length !== 16) {
      errs.cardNumber = "Card number must be 16 digits";
    }

    const rawExp = data.expDate.replace(/\D/g, "");
    if (!rawExp) {
      errs.expDate = "Expiration date is required";
    } else if (rawExp.length < 4) {
      errs.expDate = "Enter valid date (MM / YY)";
    } else {
      const month = parseInt(rawExp.slice(0, 2), 10);
      const year = parseInt(rawExp.slice(2, 4), 10) + 2000;
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        errs.expDate = "Invalid month (01 - 12)";
      } else if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        errs.expDate = "Card is expired";
      }
    }

    const rawCvc = data.cvc.replace(/\D/g, "");
    if (!rawCvc) {
      errs.cvc = "CVC is required";
    } else if (rawCvc.length < 3 || rawCvc.length > 4) {
      errs.cvc = "CVC must be 3 or 4 digits";
    }

    return errs;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") || "";
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (raw.length === 16 && errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = `${raw.slice(0, 2)} / ${raw.slice(2)}`;
    } else if (raw.length === 2 && e.target.value.length > formData.expDate.length) {
      formatted = `${raw} / `;
    }
    setFormData((prev) => ({ ...prev, expDate: formatted }));
    if (raw.length === 4 && errors.expDate) {
      setErrors((prev) => ({ ...prev, expDate: undefined }));
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData((prev) => ({ ...prev, cvc: raw }));
    if (raw.length >= 3 && errors.cvc) {
      setErrors((prev) => ({ ...prev, cvc: undefined }));
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 5);
    setFormData((prev) => ({ ...prev, zipCode: raw }));
    if (raw.length === 5 && errors.zipCode) {
      setErrors((prev) => ({ ...prev, zipCode: undefined }));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      const firstField = document.getElementById(`checkout-${errorKeys[0]}`);
      firstField?.focus();
      firstField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    handleOrderPayment(e);
  };

  return (
    <div className="flex w-full px-1 md:px-0 flex-col">
      <div className="block md:hidden bg-escrow-surface border border-escrow-outline rounded-lg p-3.5 mb-4">
        <Typography
          variant="h3"
          className="flex items-center gap-2 text-[13px]! font-medium! leading-snug text-escrow-foreground"
        >
          <Icon icon="akar-icons:lock-on" className="w-4 h-4 shrink-0 text-escrow-icon" />
          Your payment will be held securely until you confirm delivery.
        </Typography>
      </div>

      <Typography variant="h3" className="hidden md:block">
        Checkout
      </Typography>
      <Typography
        variant="caption"
        className="text-content-secondary text-[14px] hidden md:block py-2 pb-4"
      >
        Verify your details to secure this high-value transaction in escrow.
      </Typography>

      <div className="flex items-center gap-2 py-3">
        <span className="hidden md:flex items-center justify-center bg-page-tertiary w-5 h-5 rounded-full text-[12px] font-semibold text-content-primary">
          1
        </span>
        <Typography variant="h3" className="text-[16px]! font-semibold! text-content-primary">
          Shipping Details
        </Typography>
      </div>

      <div>
        <form
          className="flex flex-col gap-3 md:gap-5"
          onSubmit={onSubmit}
          id="checkout-form"
          noValidate
        >
          <TextField
            id="checkout-fullName"
            name="fullName"
            type="text"
            placeholder="Sarah Jenkins"
            label="Full Name"
            required={true}
            value={formData.fullName}
            errorMessage={errors.fullName}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, fullName: e.target.value }));
              if (errors.fullName && e.target.value.trim().length >= 2) {
                setErrors((prev) => ({ ...prev, fullName: undefined }));
              }
            }}
          />

          <TextField
            id="checkout-addressLine1"
            name="addressLine1"
            type="text"
            placeholder="1042 Market Street"
            label="Address Line"
            required={true}
            value={formData.addressLine1}
            errorMessage={errors.addressLine1}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, addressLine1: e.target.value }));
              if (errors.addressLine1 && e.target.value.trim().length >= 3) {
                setErrors((prev) => ({ ...prev, addressLine1: undefined }));
              }
            }}
          />

          <TextField
            id="checkout-addressLine2"
            name="addressLine2"
            type="text"
            placeholder="Suite 400"
            label="Address Line 2 (Optional)"
            required={false}
            value={formData.addressLine2}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))
            }
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="w-full">
              <TextField
                id="checkout-city"
                name="city"
                type="text"
                placeholder="San Francisco"
                label="City"
                required={true}
                value={formData.city}
                errorMessage={errors.city}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, city: e.target.value }));
                  if (errors.city && e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, city: undefined }));
                  }
                }}
              />
            </div>

            <div className="flex w-full sm:w-[220px] gap-2">
              <div className="w-1/2 sm:w-[90px]">
                <TextField
                  id="checkout-state"
                  name="state"
                  type="text"
                  placeholder="CA"
                  label="State"
                  required={true}
                  value={formData.state}
                  errorMessage={errors.state}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, state: e.target.value }));
                    if (errors.state && e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, state: undefined }));
                    }
                  }}
                />
              </div>

              <div className="w-1/2 sm:w-[122px]">
                <TextField
                  id="checkout-zipCode"
                  name="zipCode"
                  type="number"
                  placeholder="94103"
                  label="ZIP Code"
                  required={true}
                  maxLength={5}
                  value={formData.zipCode}
                  errorMessage={errors.zipCode}
                  onChange={handleZipCodeChange}
                />
              </div>
            </div>
          </div>

          <DropDown
            label="Country"
            value={formData.country}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, country: val }));
              if (errors.country) {
                setErrors((prev) => ({ ...prev, country: undefined }));
              }
            }}
          />

          <div className="border-b pt-4 text-outline-subtle" />

          <div className="flex items-center gap-2 py-3">
            <span className="flex items-center justify-center bg-page-tertiary w-5 h-5 rounded-full text-[12px] font-semibold text-content-primary">
              2
            </span>
            <Typography variant="h3" className="text-[16px]! font-semibold! text-content-primary">
              Secure Payment
            </Typography>
          </div>

          <TextField
            id="checkout-cardNumber"
            name="cardNumber"
            type="number"
            placeholder="4242 4242 4242 4242"
            label="Card Number"
            required={true}
            maxLength={19}
            value={formData.cardNumber}
            errorMessage={errors.cardNumber}
            onChange={handleCardNumberChange}
            endIcon={
              <Icon
                icon="lucide:credit-card"
                className="w-5 h-5 text-accent-default"
              />
            }
          />

          <div className="flex gap-3">
            <div className="w-full">
              <TextField
                id="checkout-expDate"
                name="expDate"
                type="text"
                inputMode="numeric"
                placeholder="MM / YY"
                label="Expiration Date"
                required={true}
                maxLength={7}
                value={formData.expDate}
                errorMessage={errors.expDate}
                onChange={handleExpDateChange}
              />
            </div>

            <div className="w-full">
              <TextField
                id="checkout-cvc"
                name="cvc"
                type="number"
                placeholder="•••"
                label="CVC"
                required={true}
                maxLength={4}
                value={formData.cvc}
                errorMessage={errors.cvc}
                onChange={handleCvcChange}
              />
            </div>
          </div>

          <Typography
            variant="caption"
            className="flex items-center gap-2 text-[12px]! font-normal text-content-secondary py-2"
          >
            <Icon icon="bi:shield-check" className="text-success-icon w-4 h-4 shrink-0" />
            Your data is encrypted natively using bank-grade AES-256 protocols.
          </Typography>
        </form>
      </div>
    </div>
  );
}
