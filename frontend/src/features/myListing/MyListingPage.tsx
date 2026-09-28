import { useState } from "react";
import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import LisitingContent from "./components/ListingContent";

export default function MyListingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className={isFormOpen ? "hidden md:block" : "block"}>
        <NavBar buttonLabel="+ Sell" isAuth={true} />
      </div>
      <div>
        <LisitingContent onFormOpenChange={setIsFormOpen} />
      </div>
    </>
  );
}
