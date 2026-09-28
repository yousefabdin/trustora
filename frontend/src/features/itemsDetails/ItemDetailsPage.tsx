import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import ProductSection from "./components/ProductSection";
import ListingDescription from "../marketBrowse/components/ListingDescription";
import { marketplaceListings } from "@/utils/ItemsSeed";

import { useParams } from "react-router-dom";
export default function ItemDetailsPage() {
  const { id } = useParams();
  const itemId = Number(id);
  const item = marketplaceListings.find((item) => item.id === itemId);
  return (
    <div className="bg-page-primary min-h-screen">
      <div className="hidden md:block">
        <NavBar buttonLabel="+Sell" isAuth={true} />
      </div>
      <ProductSection item={item} />
      <div className="hidden md:block">
        <ListingDescription item={item} />
      </div>
    </div>
  );
}
