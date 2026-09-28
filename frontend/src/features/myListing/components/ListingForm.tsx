import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import DropDown from "@/components/molecules/inputs/DropDown";
import FileUploader from "@/components/molecules/inputs/FileUploader";
import TextArea from "@/components/molecules/inputs/TextArea";
import TextField from "@/components/molecules/inputs/TextField";
import { createItem } from "@/services/Listingservice";
import { Icon } from "@iconify/react";
import { useState } from "react";

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
  status: "Active" | "Sold" | "Draft";
  views: number;
}

interface CreateListingProps {
  setModal: (value: boolean) => void;
  mode: "create" | "edit";
  selectedListing?: Listing;
  sellerItems?: any[];
  user?: any;
}
export default function ListingForm({
  setModal,
  mode,
  selectedListing,
  user,
}: CreateListingProps) {
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

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setCondition("");
    setImages([null, null, null, null]);
  };

  const handleDelete = () => {
    setModal(false);
  };

  const handleListingFrom = (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = images
      .filter((image): image is File => image !== null)
      .map((image) => URL.createObjectURL(image));
    const newListing = createItem({
      title,
      description,
      category,
      condition,
      images: imageUrls,
      price: price ? Number(price.replace(/[^0-9.]/g, "")) : 0,
      sellerId: user?.id ?? "",
    });
    setModal(false);

    console.log(newListing);
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
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 p-1 cursor-pointer transition-colors"
            title="Delete Listing"
          >
            <Icon
              icon={"akar-icons:trash-can"}
              className="text-xl text-red-500"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="hidden md:flex flex-col gap-[8px]">
        <div className="flex items-center gap-[8px] ">
          <Typography
            variant={"label"}
            children={"My Listings"}
            className="text-accent-default text-[12px] font-[400]!"
          ></Typography>
          <Icon
            icon={"akar-icons:chevron-right"}
            className="h-3 mt-0.5 text-[#9C9C99]"
          ></Icon>
          <Typography
            variant={"label"}
            children={isEdit ? "Edit Listing" : "New Listing"}
            className="text-[#9C9C99] text-[12px] font-[400]!"
          ></Typography>
        </div>
        <Typography
          variant={"h2"}
          children={isEdit ? "Edit Listing" : "Create New Listing"}
          className="text-[28px]! font-[800]!"
        ></Typography>
      </div>

      <div className="w-full h-full md:bg-page-primary md:border border-page-tertiary md:p-[32px] rounded-[6px]">
        <form
          action=""
          className="flex flex-col gap-[20px] md:gap-[24px] w-full p-0 md:p-[16px]"
          onSubmit={handleListingFrom}
        >
          <TextField
            type={"text"}
            placeholder={"Enter title"}
            label={"Listing Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required={true}
            confirmation={false}
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
            <div className="flex-1 ">
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
            <div className="flex-1 ">
              <DropDown
                value={category}
                onChange={setCategory}
                label={"Category"}
                options={categories}
                placeholder="Select category"
              ></DropDown>
            </div>
            <div className="flex-1 ">
              <DropDown
                value={condition}
                onChange={setCondition}
                placeholder="Select condition"
                label={"Condition"}
                options={conditions}
              ></DropDown>
            </div>
          </div>
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
            <div className="space-x-[12px]">
              <Button
                variant="secondary"
                children={isEdit ? "Delete Listing" : "Save Listing"}
                onClick={isEdit ? handleDelete : () => setModal(false)}
              ></Button>
              <Button
                children={isEdit ? "Save Listing" : "Publish Listing"}
                variant="primary"
                type="submit"
              ></Button>
            </div>
          </div>

          {/* Mobile action buttons matching Screen 2 & Screen 3 */}
          <div className="flex md:hidden flex-col gap-3 w-full mt-4">
            {isEdit ? (
              <>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full text-center text-red-600 font-semibold text-sm hover:underline py-1 transition-colors cursor-pointer"
                >
                  Delete Listing
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors cursor-pointer"
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold rounded-lg text-sm transition-colors cursor-pointer"
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
