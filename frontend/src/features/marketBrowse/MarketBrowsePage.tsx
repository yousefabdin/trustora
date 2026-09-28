import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import MarketplaceBrowse from "./components/MarketplaceBrowse";

export default function MarketBrowsePage() {
  return (
    <div>
      <NavBar buttonLabel="+ Sell" isAuth={true} />
      <MarketplaceBrowse />
    </div>
  );
}
