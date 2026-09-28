import { Icon } from "@iconify/react";

export const icons = {
  pendingPayment: (
    <Icon color="var(--info-foreground)" icon="mingcute:time-line"></Icon>
  ),
  paidHeld: <Icon icon="boxicons:lock"></Icon>,
  shipped: <Icon icon="lucide:van"></Icon>,
  delivered: (
    <Icon color="var(--success-foreground)" icon="ix:success"></Icon>
  ),
  released: (
    <Icon
      color="var(--danger-foreground)"
      icon="material-symbols:warning-outline-rounded"
    ></Icon>
  ),
  refundIcon: (
    <Icon icon="meteor-icons:move-left" color="var(--neutral-black)"></Icon>
  ),
};
