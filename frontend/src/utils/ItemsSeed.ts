export interface MarketplaceListing {
  id: number;
  itemName: string;
  itemPrice: number;
  sellerName: string;
  sellerAvatar: string;
  condition: "New" | "Like New" | "Good" | "Refurbished";
  rating: number;
  category: string;
  img: string;
  images: string[];
  firstDescription: string;
  secondDescription: string;
}

export const marketplaceListings: MarketplaceListing[] = [
  {
    id: 1,
    itemName: "Custom Headphones",
    itemPrice: 25.88,
    sellerName: "Retro Furnishings",
    sellerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    condition: "Like New",
    rating: 4.8,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Experience immersive high-fidelity audio with custom-tuned acoustic drivers.",
    secondDescription:
      "Designed with memory foam ear cushions for maximum comfort during extended listening sessions.",
  },
  {
    id: 2,
    itemName: "Rustic Chair",
    itemPrice: 335.36,
    sellerName: "Boutique Finds",
    sellerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.5,
    category: "Furniture",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Handcrafted from solid oak, bringing natural warmth and timeless character to any living space.",
    secondDescription:
      "Features an ergonomic backrest and reinforced wooden joints built to last for generations.",
  },
  {
    id: 3,
    itemName: "Modern Camera",
    itemPrice: 198.54,
    sellerName: "Sarah's Thrift",
    sellerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    condition: "Refurbished",
    rating: 4.7,
    category: "Photography",
    img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "A lightweight mirrorless camera engineered for crisp detail and fast autofocus tracking.",
    secondDescription:
      "Includes 4K video recording capabilities and built-in Wi-Fi for quick mobile transfers.",
  },
  {
    id: 4,
    itemName: "Rustic Desk Lamp",
    itemPrice: 234.83,
    sellerName: "Sarah's Thrift",
    sellerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.3,
    category: "Home Decor",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Industrial-inspired steel lighting piece with a warm Edison bulb for cozy ambient study illumination.",
    secondDescription:
      "Equipped with an adjustable arm and a heavy anti-slip base for precision lighting.",
  },
  {
    id: 5,
    itemName: "Rustic Planter",
    itemPrice: 320.08,
    sellerName: "Melody Music Shop",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.9,
    category: "Home & Garden",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Hand-thrown terracotta pot perfect for showcasing house plants, succulents, or small herbs.",
    secondDescription:
      "Comes with built-in drainage holes and a matching drip saucer to prevent overwatering.",
  },
  {
    id: 6,
    itemName: "Sleek Camera",
    itemPrice: 136.01,
    sellerName: "Hobbyist Corner",
    sellerAvatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    condition: "Like New",
    rating: 4.6,
    category: "Photography",
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Minimalist pocket camera tailored for street photography and spontaneous daily snapshots.",
    secondDescription:
      "Boasts intuitive physical control dials and impressive low-light performance.",
  },
  {
    id: 7,
    itemName: "Handcrafted Desk Mat",
    itemPrice: 163.01,
    sellerName: "Pottery By Jane",
    sellerAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.9,
    category: "Office Supplies",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Full-grain leather desk pad designed to elevate workspace aesthetics and protect surface finishes.",
    secondDescription:
      "Smooth tracking surface compatible with all optical mice, backed by natural felt.",
  },
  {
    id: 8,
    itemName: "Luxury Headphones",
    itemPrice: 55.34,
    sellerName: "Tech Haven",
    sellerAvatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    condition: "Refurbished",
    rating: 4.2,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Premium wireless over-ear headphones featuring active noise cancellation technology.",
    secondDescription:
      "Provides up to 30 hours of continuous playback with ultra-fast USB-C charging.",
  },
  {
    id: 9,
    itemName: "Luxury Monitor",
    itemPrice: 130.07,
    sellerName: "Sarah's Thrift",
    sellerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.4,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Ultra-wide 4K display offering vibrant color accuracy for creative work and immersive media.",
    secondDescription:
      "Features ultra-slim bezels, HDR support, and multi-device connection ports.",
  },
  {
    id: 10,
    itemName: "Premium Headphones",
    itemPrice: 438.31,
    sellerName: "Melody Music Shop",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 5.0,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Studio-grade monitor headphones crafted for sound engineers and audiophiles.",
    secondDescription:
      "Delivers spatial audio soundscapes with rich bass response and crystal-clear highs.",
  },
  {
    id: 11,
    itemName: "Premium Watch",
    itemPrice: 375.79,
    sellerName: "Elite Store",
    sellerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    condition: "Like New",
    rating: 4.8,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Automatic timepiece encased in scratch-resistant stainless steel with a sapphire crystal glass lens.",
    secondDescription:
      "Water-resistant up to 50 meters, featuring a genuine leather strap and glowing dials.",
  },
  {
    id: 12,
    itemName: "Organic Guitar",
    itemPrice: 321.49,
    sellerName: "Sarah's Thrift",
    sellerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.5,
    category: "Musical Instruments",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Sustainably sourced wooden acoustic guitar producing warm tones and resonant acoustic depth.",
    secondDescription:
      "Includes a smooth rosewood fretboard and precision-sealed tuning keys.",
  },
  {
    id: 13,
    itemName: "Minimalist Ceramic Mug",
    itemPrice: 387.06,
    sellerName: "Hobbyist Corner",
    sellerAvatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.9,
    category: "Home & Kitchen",
    img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Matte-finished stoneware ceramic mug designed to hold heat while offering a tactile grip.",
    secondDescription:
      "Dishwasher and microwave safe with a generous 14 oz capacity for morning brew.",
  },
  {
    id: 14,
    itemName: "Classic Backpack",
    itemPrice: 212.23,
    sellerName: "Hobbyist Corner",
    sellerAvatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    condition: "Like New",
    rating: 4.6,
    category: "Bags & Luggage",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Water-resistant canvas daypack engineered with dedicated padded sleeves for up to 15-inch laptops.",
    secondDescription:
      "Features ergonomic shoulder straps and multiple quick-access zip pockets.",
  },
  {
    id: 15,
    itemName: "Handcrafted Sneakers",
    itemPrice: 169.54,
    sellerName: "Boutique Finds",
    sellerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.8,
    category: "Footwear",
    img: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Artisanal footwear made with premium leather uppers and breathable textile lining.",
    secondDescription:
      "Outfitted with durable rubber outsoles and cushioned insoles for all-day streetwear wear.",
  },
  {
    id: 16,
    itemName: "Bespoke Wallet",
    itemPrice: 296.9,
    sellerName: "Elite Store",
    sellerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.9,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Slim bi-fold leather wallet with integrated RFID-blocking technology for security.",
    secondDescription:
      "Hand-stitched detailing featuring 6 card slots and a dedicated bill compartment.",
  },
  {
    id: 17,
    itemName: "Premium Desk Lamp",
    itemPrice: 86.08,
    sellerName: "Melody Music Shop",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    condition: "Like New",
    rating: 4.4,
    category: "Home Decor",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Modern LED task lamp with customizable brightness settings and color temperature controls.",
    secondDescription:
      "Includes an integrated wireless charging pad on the base for phone convenience.",
  },
  {
    id: 18,
    itemName: "Custom Vinyl Record",
    itemPrice: 110.53,
    sellerName: "The Daily Grind",
    sellerAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.7,
    category: "Music & Audio",
    img: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Heavyweight 180g pressed vinyl delivering analog warmth and pure acoustic depth.",
    secondDescription:
      "Comes packaged in a full-color protective sleeve with custom inner artwork.",
  },
  {
    id: 19,
    itemName: "Rustic Gaming Keyboard",
    itemPrice: 365.19,
    sellerName: "Melody Music Shop",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.8,
    category: "Gaming & Tech",
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Custom mechanical keyboard encased in real hardwood with tactile mechanical switches.",
    secondDescription:
      "Features hot-swappable key sockets, subtle backlighting, and a braided USB cable.",
  },
  {
    id: 20,
    itemName: "Modern Guitar",
    itemPrice: 412.21,
    sellerName: "Elite Store",
    sellerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    condition: "Like New",
    rating: 4.9,
    category: "Musical Instruments",
    img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Solid-body electric guitar designed with versatile dual humbucker pickups for clean dynamic tone.",
    secondDescription:
      "Contoured body shape with a fast satin neck profile for swift fretboard movement.",
  },
  {
    id: 21,
    itemName: "Rustic Planter",
    itemPrice: 232.17,
    sellerName: "Crafty Hands",
    sellerAvatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.3,
    category: "Home & Garden",
    img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Weathered stoneware pot crafted to complement indoor houseplants and patio arrangements.",
    secondDescription:
      "Porous ceramic material promotes root health and natural moisture regulation.",
  },
  {
    id: 22,
    itemName: "Handcrafted Backpack",
    itemPrice: 75.74,
    sellerName: "Daily Essentials",
    sellerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    condition: "Good",
    rating: 4.2,
    category: "Bags & Luggage",
    img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Rugged vintage-style travel rucksack made from heavy-duty waxed canvas and brass hardware.",
    secondDescription:
      "Includes expandable main storage compartments and padded adjustable shoulder support.",
  },
  {
    id: 23,
    itemName: "Premium Backpack",
    itemPrice: 339.95,
    sellerName: "Melody Music Shop",
    sellerAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.8,
    category: "Bags & Luggage",
    img: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Commuter-focused bag featuring hidden anti-theft zips and weather-sealed fabric exterior.",
    secondDescription:
      "Equipped with integrated USB charging pass-through ports and luggage strap mounts.",
  },
  {
    id: 24,
    itemName: "Classic Sneakers",
    itemPrice: 110.4,
    sellerName: "Pottery By Jane",
    sellerAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    condition: "Refurbished",
    rating: 4.1,
    category: "Footwear",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Low-top canvas sneakers tailored with a timeless silhouette for daily wear.",
    secondDescription:
      "Constructed with reinforced toe caps and flexible vulcanized rubber soles.",
  },
  {
    id: 25,
    itemName: "Sleek Ceramic Mug",
    itemPrice: 343.77,
    sellerName: "Hobbyist Corner",
    sellerAvatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    condition: "New",
    rating: 4.7,
    category: "Home & Kitchen",
    img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
    ],
    firstDescription:
      "Modern double-walled ceramic coffee cup keeping drinks warm while remaining cool to touch.",
    secondDescription:
      "Comes with a spill-resistant lid, making it ideal for desk work and travel.",
  },
];
