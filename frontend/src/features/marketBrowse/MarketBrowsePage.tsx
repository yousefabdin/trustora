import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import MarketplaceBrowse from "./components/MarketplaceBrowse";

export default function MarketBrowsePage() {
  return (
    <div>
      <NavBar isAuth={true} />
      <MarketplaceBrowse />
    </div>
  );
}
