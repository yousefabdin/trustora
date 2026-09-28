import Typography from "@/components/atoms/typography/typography";
import Cards from "@/components/molecules/cards/Cards";
import { useParams } from "react-router-dom";

export default function ListingDescription({ item }) {
  console.log(item);
  return (
    <div className="w-full flex flex-col lg:flex-row items- justify-around px-[40px] gap-[100px]">
      <div className="max-w-[800px] py-5 ">
        <Typography variant="h2" className="py-5 text-[18px] font-semibold">
          Listing Description
        </Typography>
        <Typography
          variant="caption"
          className="text-[15px] text-content-secondary"
        >
          {item.firstDescription}
        </Typography>
        <Typography
          variant="caption"
          className="py-7 block text-content-secondary text-[15px] leading-normal"
        >
          {item.secondDescription}
        </Typography>
      </div>
      <div className="min-w-[500px] ">
        <Cards
          variant="sellerDetailsCard"
          sellerAvatar={"/assets/images/user"}
          username="Yousef"
        ></Cards>
      </div>
    </div>
  );
}
