import Typography from "@/components/atoms/typography/typography";

export default function SellerBuyerCard({ order }) {
  return (
    <div className="flex flex-col h-full  bg-page-primary border border-page-tertiary p-[12px] gap-[8px] rounded-[8px] ">
      <div className="flex justify-between ">
        <div className="flex items-center gap-2">
          <img
            src={order.sellerAvatar}
            alt=""
            className="rounded-[14px] w-[28px] h-[28px]"
          />
          <div className="flex flex-col">
            <Typography
              variant={"caption"}
              children={"Seller"}
              className=" text-[#9C9C99] text-[11px]! uppercase"
            ></Typography>
            <Typography
              variant={"label"}
              children={order.sellerName}
            ></Typography>
          </div>
        </div>
        <Typography
          variant={"caption"}
          className="flex items-center gap-2 text-content-secondary font-[700]!  text-[12px]! uppercase"
        >
          <img src="assets/images/starImg.png" alt="" /> 4.9
        </Typography>
      </div>
      <hr className="text-page-tertiary my-2" />
      <div className="flex justify-between ">
        <div className="flex items-center gap-2">
          <img
            src={order.sellerAvatar}
            alt=""
            className="rounded-[14px] w-[28px] h-[28px]"
          />
          <div className="flex flex-col">
            <Typography
              variant={"caption"}
              children={"Buyer"}
              className=" text-[#9C9C99] text-[11px]! uppercase"
            ></Typography>
            <Typography
              variant={"label"}
              children={order.sellerName}
            ></Typography>
          </div>
        </div>
        <Typography
          variant={"caption"}
          className="flex items-center gap-2 text-content-secondary font-[700]!  text-[12px]! uppercase"
        >
          <img src="assets/images/starImg.png" alt="" /> 5.0
        </Typography>
      </div>
    </div>
  );
}
