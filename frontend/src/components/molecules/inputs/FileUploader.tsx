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
        className="relative flex cursor-pointer items-center justify-center w-[72px] h-[72px] sm:w-[80px] sm:h-[72px] border border-dashed border-gray-300 rounded-lg overflow-hidden bg-white hover:bg-gray-50 transition-colors group"
      >
        {!preview ? (
          <Icon icon="akar-icons:plus" className="text-gray-400 text-lg group-hover:text-indigo-600 transition-colors" />
        ) : (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (fileInput.current) fileInput.current.value = "";
                if (objectUrlRef.current) {
                  URL.revokeObjectURL(objectUrlRef.current);
                  objectUrlRef.current = null;
                }
                setPreview(null);
                onChange(null);
              }}
              className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer z-10 shadow-xs"
              title="Remove image"
            >
              <Icon icon="lucide:x" className="w-3 h-3 text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
