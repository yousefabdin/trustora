import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import ProductSection from "./components/ProductSection";
import { marketplaceListings } from "@/utils/ItemsSeed";
import { useListingDetails } from "@/services/itemsServices";
import { useParams, Link } from "react-router-dom";

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading, isError } = useListingDetails(id);
  if (isLoading) {
    return (
      <div className="bg-page-primary min-h-screen">
        <NavBar buttonLabel="+Sell" isAuth={true} />
        <div className="py-32 text-center text-content-secondary font-medium">
          Loading listing details...
        </div>
      </div>
    );
  }
  if (isError || !item) {
    return (
      <div className="bg-page-primary min-h-screen">
        <NavBar buttonLabel="+Sell" isAuth={true} />
        <div className="py-32 flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-bold text-content-primary">
            Listing Not Found
          </h2>
          <p className="text-content-secondary text-sm">
            This listing may have been sold or removed.
          </p>
          <Link
            to="/browse"
            className="px-4 py-2 bg-accent-default text-content-inverse rounded-md text-sm font-semibold"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-page-primary min-h-screen">
      <div className="hidden md:block">
        <NavBar buttonLabel="+Sell" isAuth={true} />
      </div>
      <ProductSection item={item} />
    </div>
  );
}
