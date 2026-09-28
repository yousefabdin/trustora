export type ListingStatus = "Active" | "Sold" | "Draft";

export type ListingCategory = "Electronics" | "Cameras" | "Collectibles";

export type ListingCondition = "New" | "Like New" | "Good" | "Fair";

export interface ListingType {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: ListingCondition;
  images: string[];
  status: ListingStatus;
  views: number;
}

export const sellerListings: ListingType[] = [
  {
    id: "listing-001",
    sellerId: "seller-003",
    name: "Vintage Leica M6",
    description:
      "Classic Leica M6 rangefinder camera in good working condition. The body has some minor cosmetic wear from normal use, while the shutter and rangefinder are functioning properly. Includes the original body cap and leather strap.",
    price: 850,
    category: "Cameras",
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Active",
    views: 124,
  },
  {
    id: "listing-002",
    sellerId: "seller-001",
    name: "Sony WH-1000XM5",
    description:
      "Sony WH-1000XM5 wireless noise-cancelling headphones. Used only a few times and kept in excellent condition. Includes the original carrying case, USB-C cable, and audio cable.",
    price: 220,
    category: "Electronics",
    condition: "Like New",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Active",
    views: 87,
  },
  {
    id: "listing-003",
    sellerId: "seller-001",
    name: "Mechanical Keyboard",
    description:
      "Compact mechanical keyboard with tactile switches and RGB backlighting. All keys are working correctly. Shows light signs of use around the keycaps but has been well maintained.",
    price: 120,
    category: "Electronics",
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Sold",
    views: 231,
  },
  {
    id: "listing-004",
    sellerId: "seller-001",
    name: "Nintendo Game Boy Color",
    description:
      "Original Game Boy Color in transparent purple. The console powers on and the buttons work properly. The screen has some minor scratches consistent with its age. Battery cover is included.",
    price: 95,
    category: "Collectibles",
    condition: "Fair",
    images: [
      "https://images.unsplash.com/photo-1551808525-51a94da706ff?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Active",
    views: 156,
  },
  {
    id: "listing-005",
    sellerId: "seller-001",
    name: "Polaroid Instant Camera",
    description:
      "Vintage Polaroid instant camera in excellent condition. The camera body is clean with minimal cosmetic wear and the lens is clear. Tested and working correctly.",
    price: 145,
    category: "Cameras",
    condition: "Like New",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Draft",
    views: 42,
  },
  {
    id: "listing-006",
    sellerId: "seller-001",
    name: "Apple AirPods Pro 2",
    description:
      "AirPods Pro 2 with USB-C charging case. Lightly used and fully functional. Both earbuds provide clear audio and active noise cancellation works correctly. Includes the charging case and replacement ear tips.",
    price: 165,
    category: "Electronics",
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1606841837239-c5a491a686a4?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Active",
    views: 198,
  },
  {
    id: "listing-007",
    sellerId: "seller-001",
    name: "Canon AE-1 Film Camera",
    description:
      "Classic Canon AE-1 35mm film camera with a 50mm lens. The camera has visible cosmetic wear but the body is solid. Shutter and light meter have been tested and are working.",
    price: 280,
    category: "Cameras",
    condition: "Fair",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Sold",
    views: 314,
  },
  {
    id: "listing-008",
    sellerId: "seller-001",
    name: "Vintage Nintendo 64",
    description:
      "Original Nintendo 64 console with two controllers. The console has some cosmetic scratches but works correctly. Controllers have been tested and all buttons respond properly.",
    price: 180,
    category: "Collectibles",
    condition: "Good",
    images: [
      "https://images.unsplash.com/photo-1551808525-51a94da706ff?auto=format&fit=crop&w=600&q=80",
    ],
    status: "Active",
    views: 267,
  },
];
