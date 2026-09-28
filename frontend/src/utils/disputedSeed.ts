export type DisputeStatus =
  | "Open"
  | "Pending Review"
  | "Resolved"
  | "Under Investigation";

export type DisputeReason =
  | "Item Not as Described"
  | "Item Damaged"
  | "Item Not Received"
  | "Wrong Item"
  | "Other";

export interface DisputeStatusHistory {
  status: DisputeStatus;
  date: string;
  title: string;
  description: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: string;
  reason: DisputeReason;
  description: string;
  priority: "Low" | "Critical" | "Medium" | "High";
  status: DisputeStatus;
  daysopen: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: DisputeStatusHistory[];
}

export const disputeData: Dispute[] = [
  {
    id: "dsp-001",
    orderId: "hld-2654-braun-tp1-radio",
    buyerId: "user-001",
    sellerId: "seller-001",
    amount: "$965.00",
    reason: "Item Not as Described",
    description:
      "The Braun TP1 received has several cosmetic imperfections that were not shown or mentioned in the original listing.",
    priority: "High",
    status: "Open",
    daysopen: "3 days",
    createdAt: "2026-07-22T09:15:00Z",
    updatedAt: "2026-07-22T09:15:00Z",

    statusHistory: [
      {
        status: "Open",
        date: "2026-07-22T09:15:00Z",
        title: "Dispute submitted",
        description:
          "The buyer opened a dispute regarding cosmetic imperfections on the item.",
      },
    ],
  },

  {
    id: "dsp-002",
    orderId: "hld-2847-vintage-leica-m6",
    buyerId: "user-002",
    sellerId: "seller-001",
    amount: "$1,260.00",
    reason: "Item Damaged",
    description:
      "The Leica M6 arrived with visible damage around the body and lens mount. The buyer provided photos showing the damage.",
    priority: "Critical",
    status: "Pending Review",
    daysopen: "2 days",
    createdAt: "2026-08-12T14:30:00Z",
    updatedAt: "2026-08-13T10:20:00Z",

    statusHistory: [
      {
        status: "Open",
        date: "2026-08-12T14:30:00Z",
        title: "Dispute submitted",
        description:
          "The buyer reported physical damage to the camera after delivery.",
      },
      {
        status: "Pending Review",
        date: "2026-08-13T10:20:00Z",
        title: "Dispute pending review",
        description: "The dispute is waiting for administrator review.",
      },
    ],
  },
  {
    id: "dsp-003",
    orderId: "hld-2756-first-edition-dune",
    buyerId: "user-003",
    sellerId: "seller-002",
    amount: "$2,115.00",
    reason: "Item Not as Described",
    description:
      "The buyer claims that the condition of the first edition book differs from the condition described in the original listing.",
    priority: "Medium",
    status: "Under Investigation",
    daysopen: "5 days",
    createdAt: "2026-08-01T11:00:00Z",
    updatedAt: "2026-08-04T15:30:00Z",

    statusHistory: [
      {
        status: "Open",
        date: "2026-08-01T11:00:00Z",
        title: "Dispute submitted",
        description:
          "The buyer reported that the book condition does not match the listing.",
      },
      {
        status: "Pending Review",
        date: "2026-08-02T09:20:00Z",
        title: "Dispute under review",
        description:
          "The administrator began reviewing the listing and order details.",
      },
      {
        status: "Under Investigation",
        date: "2026-08-04T15:30:00Z",
        title: "Further investigation required",
        description:
          "Additional evidence is being reviewed before a final decision.",
      },
    ],
  },
  {
    id: "dsp-003",
    orderId: "hld-2756-first-edition-dune",
    buyerId: "user-003",
    sellerId: "seller-002",
    amount: "$2,115.00",
    reason: "Item Not as Described",
    description:
      "The buyer claims that the condition of the first edition book differs from the condition described in the original listing.",
    priority: "Medium",
    status: "Under Investigation",
    daysopen: "5 days",
    createdAt: "2026-08-01T11:00:00Z",
    updatedAt: "2026-08-04T15:30:00Z",

    statusHistory: [
      {
        status: "Open",
        date: "2026-08-01T11:00:00Z",
        title: "Dispute submitted",
        description:
          "The buyer reported that the book condition does not match the listing.",
      },
      {
        status: "Pending Review",
        date: "2026-08-02T09:20:00Z",
        title: "Dispute under review",
        description:
          "The administrator began reviewing the listing and order details.",
      },
      {
        status: "Under Investigation",
        date: "2026-08-04T15:30:00Z",
        title: "Further investigation required",
        description:
          "Additional evidence is being reviewed before a final decision.",
      },
    ],
  },

  {
    id: "dsp-004",
    orderId: "hld-2612123-eames-lounge-chair",
    buyerId: "user-004",
    sellerId: "seller-003",
    amount: "$3,215.00",
    reason: "Other",
    description:
      "The buyer reported an issue with the delivery and requested administrator assistance in reviewing the transaction.",
    priority: "Low",
    status: "Resolved",
    daysopen: "2 days",
    createdAt: "2026-07-18T10:00:00Z",
    updatedAt: "2026-07-20T16:00:00Z",

    statusHistory: [
      {
        status: "Open",
        date: "2026-07-18T10:00:00Z",
        title: "Dispute submitted",
        description:
          "The buyer requested administrator assistance with the transaction.",
      },
      {
        status: "Pending Review",
        date: "2026-07-18T14:30:00Z",
        title: "Dispute under review",
        description:
          "The administrator reviewed the order and delivery information.",
      },
      {
        status: "Resolved",
        date: "2026-07-20T16:00:00Z",
        title: "Dispute resolved",
        description:
          "The issue was reviewed and the transaction was confirmed as completed.",
      },
    ],
  },
];
