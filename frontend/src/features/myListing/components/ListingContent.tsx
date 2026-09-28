import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import ListingLedger from "./ListingLedger";
import ListingHeader from "./Listingheader";
import ListingFooter from "./ListingFooter";
import { sellerListings } from "@/utils/sellerListingSeed";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { createItem } from "@/services/Listingservice";
import ListingForm from "./ListingForm";

interface ListingContentProps {
  onFormOpenChange?: (isOpen: boolean) => void;
}

export default function LisitingContent({
  onFormOpenChange,
}: ListingContentProps = {}) {
  const { user } = useAuth();
  const sellerItems = sellerListings.filter((item) => {
    return item.sellerId === user?.id;
  });
  const limit = 5;
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(sellerItems.length / limit),
  );
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [mode, setMode] = useState("");

  useEffect(() => {
    onFormOpenChange?.(modal || isEditOpen);
  }, [modal, isEditOpen, onFormOpenChange]);

  return (
    <div className="flex flex-col gap-[20px] md:gap-[32px] px-4 py-4 md:px-[90px] md:py-[48px] bg-page-secondary min-h-screen">
      {isEditOpen && selectedListing && (
        <ListingForm
          mode="edit"
          selectedListing={selectedListing}
          setModal={setIsEditOpen}
          user={user}
        />
      )}
      {modal && (
        <ListingForm
          setModal={setModal}
          mode="create"
          sellerItems={sellerItems}
          selectedListing={selectedListing}
          user={user}
        ></ListingForm>
      )}
      {!modal && !isEditOpen && (
        <>
          <ListingHeader
            sellerItems={sellerItems}
            setModal={setModal}
            modal={modal}
            user={user}
          />
          <ListingLedger
            setIsEditOpen={setIsEditOpen}
            currentPage={currentPage}
            sellerItems={sellerItems}
            setTotalPages={setTotalPages}
            setModal={setModal}
            user={user}
            limit={limit}
            setSelectedListing={setSelectedListing}
          />
          <ListingFooter
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            sellerItems={sellerItems}
            totalPages={totalPages}
            limit={limit}
          />
        </>
      )}
    </div>
  );
}
