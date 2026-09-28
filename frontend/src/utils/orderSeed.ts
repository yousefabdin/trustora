export type OrderStatus =
  | "Escrow Pending"
  | "In Escrow"
  | "Funds Released"
  | "Shipped"
  | "Delivered"
  | "Disputed"
  | "Refunded"
  | "Captured"
  | "Completed"
  | "Held in Escrow";

export interface OrderStatusHistory {
  status: OrderStatus;
  date: string;
  title: string;
  description: string;
}

const platformFees = 15;

export interface Order {
  id: string;
  orderNumber?: string;
  listingId: number;
  itemName: string;
  itemDescription: string;
  itemSerial: string;
  itemPrice: number;
  shipping: number;
  totalPrice: number;
  orderDate: string;
  displayDate?: string;
  status: OrderStatus;
  escrowInstructionSummary: string;
  itemImg: string;
  sellerName: string;
  sellerAvatar: string;
  buyerName: string;
  shippingMethod: string;
  trackingNumber: string;
  statusHistory: OrderStatusHistory[];
}

export const orderData: Order[] = [
  {
    id: "hld-2847-vintag3-leica-m6",
    orderNumber: "#HLD-2847",
    listingId: 101,
    itemName: "Vintage Leica M6",
    itemDescription: "Rangefinder film camera · Black finish",
    itemSerial: "#19284",
    itemPrice: 1245.0,
    shipping: 0,
    totalPrice: 1245.0 + platformFees,
    orderDate: "2026-08-08",
    displayDate: "Aug 8",
    status: "Completed",
    shippingMethod: "USPS Priority Mail",
    trackingNumber: "9400111899223847652",
    statusHistory: [
      {
        status: "Captured",
        date: "2026-08-08T10:20:00Z",
        title: "Order placed",
        description: "Escrow initialized between buyer and seller.",
      },
      {
        status: "Held in Escrow",
        date: "2026-08-08T10:22:00Z",
        title: "Payment captured and held in escrow",
        description: "Funds locked securely in Holdline contract.",
      },
      {
        status: "Shipped",
        date: "2026-08-10T14:34:00Z",
        title: "Seller shipped the item",
        description: "USPS Tracking: 9400111899223847652",
      },
      {
        status: "Delivered",
        date: "2026-08-12T11:15:00Z",
        title: "Package delivered",
        description: "Delivered, in/at mailbox. Springfield, VA 22150.",
      },
      {
        status: "Completed",
        date: "2026-08-14T11:15:00Z",
        title: "Package delivered",
        description: "Delivered, in/at mailbox. Springfield, VA 22150.",
      },
    ],
    escrowInstructionSummary:
      "Funds held securely in escrow until buyer confirms camera inspection within 48 hours.",
    itemImg:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80",
    sellerName: "Alex Mercator",
    sellerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    buyerName: "vintage_buyer", // 👈 Populated buyer name
  },
  {
    id: "hld-2756-first-edition-dune",
    orderNumber: "#HLD-2756",
    listingId: 103,
    itemName: "First Edition Dune",
    itemDescription: "Hardcover 1965 printing · Chilton Books",
    itemSerial: "#FE-90812",
    itemPrice: 2100.0,
    shipping: 0,
    totalPrice: 2100.0 + platformFees,
    orderDate: "2026-07-29",
    displayDate: "Jul 29",
    status: "Completed",
    shippingMethod: "FedEx Express",
    trackingNumber: "782941038592",
    statusHistory: [
      {
        status: "Captured",
        date: "2026-07-29T09:10:00Z",
        title: "Order placed",
        description: "Escrow initialized between buyer and seller.",
      },
      {
        status: "Held in Escrow",
        date: "2026-07-29T09:15:00Z",
        title: "Payment captured and held in escrow",
        description: "Funds locked securely in Holdline contract.",
      },
      {
        status: "Shipped",
        date: "2026-07-30T11:00:00Z",
        title: "Seller shipped the item",
        description: "FedEx Tracking: 782941038592",
      },
      {
        status: "Delivered",
        date: "2026-08-01T15:20:00Z",
        title: "Package delivered",
        description: "Delivered to front door.",
      },
      {
        status: "Funds Released",
        date: "2026-08-02T10:00:00Z",
        title: "Funds released to seller",
        description: "Buyer authenticated print and finalized transaction.",
      },
    ],
    escrowInstructionSummary:
      "Funds successfully released to seller after buyer authenticated first edition print.",
    itemImg:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
    sellerName: "rare_books",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    buyerName: "bookworm_99", // 👈 Populated buyer name
  },
  {
    id: "hld-2847-vintage-leica-m6",
    orderNumber: "#HLD-2847",
    listingId: 101,
    itemName: "Vintage Leica M6",
    itemDescription: "Rangefinder film camera · Silver finish",
    itemSerial: "#19285",
    itemPrice: 1245.0,
    shipping: 0,
    totalPrice: 1245.0 + platformFees,
    orderDate: "2026-08-08",
    displayDate: "Aug 8",
    status: "Shipped",
    shippingMethod: "USPS Priority Mail",
    trackingNumber: "9400111899223847653",
    statusHistory: [
      {
        status: "Captured",
        date: "2026-08-08T08:00:00Z",
        title: "Order placed",
        description: "Escrow initialized between buyer and seller.",
      },
      {
        status: "Held in Escrow",
        date: "2026-08-08T08:05:00Z",
        title: "Payment captured and held in escrow",
        description: "Funds locked securely in Holdline contract.",
      },
      {
        status: "Shipped",
        date: "2026-08-09T13:45:00Z",
        title: "Seller shipped the item",
        description: "USPS Tracking: 9400111899223847653",
      },
    ],
    escrowInstructionSummary:
      "Funds held securely in escrow until buyer confirms camera inspection within 48 hours.",
    itemImg:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80",
    sellerName: "camera_collector",
    sellerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    buyerName: "vintage_buyer", // 👈 Populated buyer name
  },
  {
    id: "hld-284721-vintage1-leica-m6",
    orderNumber: "#HLD-2847",
    listingId: 101,
    itemName: "Vintage Leica M6",
    itemDescription: "Rangefinder film camera · Titanium finish",
    itemSerial: "#19286",
    itemPrice: 1245.0,
    shipping: 0,
    totalPrice: 1245.0 + platformFees,
    orderDate: "2026-08-08",
    displayDate: "Aug 8",
    status: "In Escrow",
    shippingMethod: "UPS Ground",
    trackingNumber: "1Z9999999999999999",
    statusHistory: [
      {
        status: "Captured",
        date: "2026-08-08T12:00:00Z",
        title: "Order placed",
        description: "Escrow initialized between buyer and seller.",
      },
      {
        status: "Held in Escrow",
        date: "2026-08-08T12:05:00Z",
        title: "Payment captured and held in escrow",
        description: "Funds locked securely in Holdline contract.",
      },
    ],
    escrowInstructionSummary:
      "Funds held securely in escrow until buyer confirms camera inspection within 48 hours.",
    itemImg:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80",
    sellerName: "camera_collector",
    sellerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    buyerName: "film_lover", // 👈 Populated buyer name
  },
  {
    id: "hld-2654-braun-tp1-radio",
    orderNumber: "#HLD-2654",
    listingId: 105,
    itemName: "Braun TP1 Radio",
    itemDescription: "Transistor radio & record player · Dieter Rams design",
    itemSerial: "#BR-10924",
    itemPrice: 950.0,
    shipping: 0,
    totalPrice: 950.0 + platformFees,
    orderDate: "2026-07-18",
    displayDate: "Jul 18",
    status: "Disputed",
    shippingMethod: "USPS Priority Mail",
    trackingNumber: "9400111899223841111",
    statusHistory: [
      {
        status: "Captured",
        date: "2026-07-18T10:00:00Z",
        title: "Order placed",
        description: "Escrow initialized between buyer and seller.",
      },
      {
        status: "Held in Escrow",
        date: "2026-07-18T10:15:00Z",
        title: "Payment captured and held in escrow",
        description: "Funds locked securely in Holdline contract.",
      },
      {
        status: "Shipped",
        date: "2026-07-19T14:20:00Z",
        title: "Seller shipped the item",
        description: "USPS Tracking: 9400111899223841111",
      },
      {
        status: "Delivered",
        date: "2026-07-21T11:00:00Z",
        title: "Package delivered",
        description: "Delivered to buyer address.",
      },
      {
        status: "Disputed",
        date: "2026-07-22T09:15:00Z",
        title: "Dispute opened by buyer",
        description: "Escrow locked pending admin arbitration review.",
      },
    ],
    escrowInstructionSummary:
      "Buyer opened dispute regarding cosmetic imperfection. Escrow funds locked pending review.",
    itemImg:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80",
    sellerName: "vintage_tech",
    sellerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    buyerName: "audio_enthusiast",
  },
  {
    id: "hld-2612123-eames-lounge-chair",
    orderNumber: "#HLD-2612",
    listingId: 106,
    itemName: "Eames Lounge Chair",
    itemDescription: "Mid-century lounge chair & ottoman · Black leather",
    itemSerial: "#HM-884102",
    itemPrice: 3200.0,
    shipping: 0,
    totalPrice: 3200.0 + platformFees,
    orderDate: "2026-07-14",
    displayDate: "Jul 14",
    status: "Completed",
    shippingMethod: "White Glove Freight Delivery",
    trackingNumber: "FRT-9021481",
    statusHistory: [
      {
        status: "Captured",
        date: "2026-07-14T08:00:00Z",
        title: "Order placed",
        description: "Escrow initialized between buyer and seller.",
      },
      {
        status: "Held in Escrow",
        date: "2026-07-14T08:10:00Z",
        title: "Payment captured and held in escrow",
        description: "Funds locked securely in Holdline contract.",
      },
      {
        status: "Shipped",
        date: "2026-07-15T10:00:00Z",
        title: "Freight dispatch confirmed",
        description: "Carrier: White Glove Freight Delivery",
      },
      {
        status: "Delivered",
        date: "2026-07-17T16:00:00Z",
        title: "In-person delivery completed",
        description: "Chair received and inspected in person.",
      },
      {
        status: "Funds Released",
        date: "2026-07-17T16:05:00Z",
        title: "Funds released to seller",
        description: "Escrow transaction finalized upon handoff.",
      },
    ],
    escrowInstructionSummary:
      "Funds released to seller following successful in-person inspection and handoff.",
    itemImg:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=300&q=80",
    sellerName: "mod_furniture",
    sellerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    buyerName: "interior_collector",
  },
];
