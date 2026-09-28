import { Icon } from "@iconify/react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

interface FileUploaderProps {
  name?: string;
  value?: File | null;
  initialPreview?: string | null;
  onChange: (file: File | null) => void;
}

export default function FileUploader({
  name = "image",
  value,
  initialPreview = null,
  onChange,
}: FileUploaderProps) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [preview, setPreview] = useState<string | null>(initialPreview);

  useEffect(() => {
    if (!value) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreview(initialPreview);
      return;
    }

    const imageUrl = URL.createObjectURL(value);

    // createObjectURL returns the same URL for the same File object.
    // Only revoke a previous preview when the user picks a different file —
    // do not revoke on unmount, because ListingForm may store this URL in the listing.
    if (objectUrlRef.current && objectUrlRef.current !== imageUrl) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = imageUrl;
    setPreview(imageUrl);
  }, [value, initialPreview]);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange(file);
    console.log("FILE RECEIVED:", file);
  };

  const handleOpenFilePicker = () => {
    fileInput.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInput}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleChangeFile}
        className="hidden"
      />

      <div
        onClick={handleOpenFilePicker}
        className="relative flex cursor-pointer items-center justify-center w-[72px] h-[72px] sm:w-[80px] sm:h-[72px] border border-dashed border-gray-300 rounded-lg overflow-hidden bg-white hover:bg-gray-50 transition-colors"
      >
        {!preview ? (
          <Icon icon="akar-icons:plus" className="text-gray-400 text-lg" />
        ) : (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center pointer-events-none">
              <Icon icon="lucide:aperture" className="text-white text-[10px]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
