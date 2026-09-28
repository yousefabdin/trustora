import { disputeData } from "@/utils/disputedSeed";
export const getDisputeById = async (disputeId: string) => {
  return disputeData.find((dispute) => dispute.id === disputeId);
};
