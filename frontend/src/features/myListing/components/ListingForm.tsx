import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import DropDown from "@/components/molecules/inputs/DropDown";
import FileUploader from "@/components/molecules/inputs/FileUploader";
import TextArea from "@/components/molecules/inputs/TextArea";
import TextField from "@/components/molecules/inputs/TextField";
import { Icon } from "@iconify/react";
import { useState } from "react";
import clsx from "clsx";
import {
  createListing,
  updateListing,
  deleteListing,
} from "@/services/ListingService";
import { getApiErrorMessage } from "@/apis/axios";
import { showToast } from "@/components/molecules/toast/Toast";

const categories = [
  { code: "cameras", name: "Cameras & Photography" },
  { code: "electronics", name: "Electronics" },
  { code: "collectibles", name: "Collectibles" },
];

const conditions = [
  { code: "excellent", name: "Excellent" },
  { code: "new", name: "New" },
  { code: "like-new", name: "Like New" },
  { code: "good", name: "Good" },
  { code: "fair", name: "Fair" },
];

interface Listing {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  status: "Active" | "Sold" | "Draft" | string;
  views: number;
}

interface CreateListingProps {
  setModal: (value: boolean) => void;
  mode: "create" | "edit";
  selectedListing?: Listing;
  sellerItems?: any[];
  user?: any;
  onSuccess?: () => void;
}

export default function ListingForm({
  setModal,
  mode,
  selectedListing,
  onSuccess,
}: CreateListingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";
  const [title, setTitle] = useState(selectedListing?.name ?? "");

  const [description, setDescription] = useState(
    selectedListing?.description ?? "",
  );

  const [price, setPrice] = useState(
    selectedListing ? String(selectedListing.price) : "",
  );
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [category, setCategory] = useState(
    selectedListing?.category?.toLowerCase() === "cameras"
      ? "cameras"
      : (selectedListing?.category ?? ""),
  );

  const [condition, setCondition] = useState(
    selectedListing?.condition?.toLowerCase() === "good"
      ? "good"
      : (selectedListing?.condition ?? ""),
  );

  const initialStatus =
    (selectedListing?.status?.toLowerCase() as "active" | "draft" | "sold") ||
    "active";
  const [listingStatus, setListingStatus] = useState<"active" | "draft" | "sold">(
    initialStatus === "sold" ? "sold" : initialStatus === "draft" ? "draft" : "active",
  );

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setCondition("");
    setImages([null, null, null, null]);
  };

  const handleDelete = async () => {
    if (!selectedListing?.id) return;

    if (!confirm("Are you sure you want to remove this listing?")) return;
    try {
      setIsSubmitting(true);
      await deleteListing(selectedListing.id);
      showToast({
        variant: "info",
        message: "Listing removed from inventory",
      });
      onSuccess?.();
      setModal(false);
    } catch (error) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(error, "Failed to remove listing"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (targetStatus?: "active" | "draft" | "sold") => {
    const finalStatus = targetStatus || listingStatus;
    const cleanPrice = Number(String(price).replace(/[^0-9.]/g, ""));
    if (!cleanPrice || cleanPrice <= 0) {
      showToast({
        variant: "info",
        message: "Please enter a valid price",
      });
      return;
    }
    const priceCents = Math.round(cleanPrice * 100);

    try {
      setIsSubmitting(true);
      if (isEdit && selectedListing?.id) {
        await updateListing(selectedListing.id, {
          title,
          description,
          category: category || "electronics",
          priceCents,
          status: finalStatus,
        });
        showToast({
          variant: "success",
          message:
            finalStatus === "draft"
              ? "Listing saved as Draft (hidden from marketplace)!"
              : finalStatus === "sold"
              ? "Listing marked as Sold!"
              : "Listing updated and active on marketplace!",
        });
      } else {
        await createListing({
          title,
          description,
          category: category || "electronics",
          priceCents,
          status: finalStatus === "draft" ? "draft" : "active",
        });
        showToast({
          variant: "success",
          message:
            finalStatus === "draft"
              ? "Listing saved to Drafts (hidden from marketplace)!"
              : "Listing published to marketplace!",
        });
      }
      onSuccess?.();
      setModal(false);
    } catch (error) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(error, "Failed to save listing"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px] md:gap-[32px] w-full">
      <div className="flex md:hidden justify-between items-center w-full py-1">
        <button
          type="button"
          onClick={() => setModal(false)}
          className="flex items-center gap-2 text-gray-900 cursor-pointer"
        >
          <Icon icon={"akar-icons:arrow-left"} className="text-xl" />
          <span className="text-base font-bold text-gray-900">
            {isEdit ? "Edit Listing" : "New Listing"}
          </span>
        </button>

        {isEdit ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="hidden md:flex justify-between items-center w-full">
        <div>
          <Typography
            variant={"h2"}
            children={isEdit ? "Edit Listing" : "Create New Listing"}
            className="text-[26px] md:text-[28px] font-[800]! text-gray-900"
          ></Typography>
          <Typography
            variant={"body"}
            children={
              isEdit
                ? "Update your item information, pricing, or status."
                : "Fill out the details below to list your item in the escrow marketplace."
            }
            className="text-[12px] md:text-[14px] text-content-secondary mt-1"
          ></Typography>
        </div>
        <div className="flex items-center gap-[12px]">
          <Button
            variant="secondary"
            children={"Clear All"}
            size="small"
            className="py-[12px] px-[20px] rounded-[6px]!"
            onClick={handleClear}
          ></Button>
        </div>
      </div>

      <div className="p-[16px] md:p-[24px] bg-white border border-border-default rounded-[12px] w-full">
        <form
          className="flex flex-col gap-[20px] md:gap-[24px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <TextField
            label={"Title"}
            required={true}
            placeholder={"e.g. Sony Alpha a7 IV Mirrorless Camera"}
            type={"text"}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          ></TextField>

          <TextArea
            label={"Description"}
            required={true}
            maxLength={300}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder={"Describe what you are selling..."}
          ></TextArea>

          <div className="flex flex-col md:flex-row justify-between gap-[20px] md:gap-[24px] w-full">
            <div className="flex-1">
              <TextField
                type={"number"}
                placeholder={"$0.00"}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                label={"Price"}
                required={true}
                confirmation={false}
              ></TextField>
            </div>
            <div className="flex-1">
              <DropDown
                value={category}
                onChange={setCategory}
                label={"Category"}
                options={categories}
                placeholder="Select category"
              ></DropDown>
            </div>
            <div className="flex-1">
              <DropDown
                value={condition}
                onChange={setCondition}
                placeholder="Select condition"
                label={"Condition"}
                options={conditions}
              ></DropDown>
            </div>
          </div>

          {/* Status selector in edit mode */}
          {isEdit && (
            <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Listing State
              </label>
              <div className="flex items-center gap-3">
                {listingStatus === "sold" ? (
                  <span className="px-3 py-1.5 rounded-md text-xs font-bold uppercase bg-neutral-100 text-neutral-600 border border-neutral-300">
                    Sold (Item has been purchased)
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setListingStatus("active")}
                      className={clsx(
                        "px-3 py-1.5 text-xs font-bold uppercase rounded-md border transition-all cursor-pointer",
                        listingStatus === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-400 ring-2 ring-emerald-500/20"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100",
                      )}
                    >
                      Active (Live on Marketplace)
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingStatus("draft")}
                      className={clsx(
                        "px-3 py-1.5 text-xs font-bold uppercase rounded-md border transition-all cursor-pointer",
                        listingStatus === "draft"
                          ? "bg-amber-50 text-amber-700 border-amber-400 ring-2 ring-amber-500/20"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100",
                      )}
                    >
                      Draft (Hidden)
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-inter text-[12px] font-medium text-content-primary">
              Images
            </label>
            <div className="grid grid-cols-4 gap-2.5 sm:flex sm:gap-[12px]">
              {images.map((image, index) => (
                <FileUploader
                  key={index}
                  value={image}
                  initialPreview={selectedListing?.images?.[index] ?? null}
                  onChange={(file) => {
                    setImages((prev) => {
                      const updated = [...prev];
                      updated[index] = file;
                      return updated;
                    });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex justify-between mt-4">
            <Button
              variant="secondary"
              children={"Cancel"}
              onClick={() => setModal(false)}
            ></Button>
            <div className="space-x-[12px] flex items-center">
              {isEdit ? (
                <>
                  <Button
                    variant="secondary"
                    children={"Delete Listing"}
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  ></Button>
                  <Button
                    children={isSubmitting ? "Saving..." : "Save Changes"}
                    variant="primary"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSave()}
                  ></Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    children={isSubmitting ? "Saving..." : "Save as Draft"}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSave("draft")}
                  ></Button>
                  <Button
                    children={isSubmitting ? "Publishing..." : "Publish Listing"}
                    variant="primary"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSave("active")}
                  ></Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile action buttons */}
          <div className="flex md:hidden flex-col gap-3 w-full mt-4">
            {isEdit ? (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSave()}
                  className="w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDelete}
                  className="w-full text-center text-red-600 font-semibold text-sm hover:underline py-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Delete Listing
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSave("active")}
                  className="w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSave("draft")}
                  className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save Draft
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
