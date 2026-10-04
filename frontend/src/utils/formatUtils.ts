export const formatOrderNumber = (orderId) => {
  return `${orderId.slice(0, 8).toUpperCase()}`;
};
export const formatDisputeId = (id: string): string => {
  if (id.startsWith("#")) return id;
  if (id.startsWith("dsp-00")) {
    return `#${id.replace("dsp-00", "D-014")}`;
  }
  if (id.startsWith("dsp-")) {
    return `#${id.replace("dsp-", "D-01")}`;
  }
  return `#${id.toUpperCase()}`;
};
