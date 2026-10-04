import { orderData, type Order } from "@/utils/orderSeed";
import { disputeData } from "@/utils/disputedSeed";
import type { UserRole } from "@/types/auth";

export interface AccountField {
  label: string;
  value: string;
  icon: string;
  badge?: {
    text: string;
    icon: string;
    className: string;
  } | null;
}

export interface ProfileStat {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bg: string;
}

export interface ProfileActivityItem {
  id: string;
  title: string;
  description: string;
  date: string;
  orderNumber?: string;
  itemName?: string;
  type: "escrow" | "shipping" | "delivery" | "release" | "dispute";
}

export interface VerificationItem {
  title: string;
  description: string;
  status: string;
  isComplete: boolean;
  icon: string;
}

export interface RoleProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  role: UserRole;
  roleTitle: string;
  roleBadge: string;
  badgeType: "buyer" | "seller" | "admin";
  avatar: string;
  notificationsEnabled: boolean;
  accountFields: AccountField[];
  stats: ProfileStat[];
  statsOverviewTitle: string;
  statsSubtitle: string;
  escrowNotice: {
    title: string;
    description: string;
    icon: string;
  };
  verifications: VerificationItem[];
  verificationLevel: string;
  activities: ProfileActivityItem[];
  activitySubtitle: string;
  recentOrdersTitle: string;
  recentOrdersSubtitle: string;
  orders: Order[];
  ordersViewAllLink: string;
  ordersViewAllLabel: string;
  quickActions: {
    label: string;
    href: string;
    icon: string;
    variant: "primary" | "secondary";
  }[];
}

export const getProfileDataForRole = (
  role: UserRole,
  userName?: string,
  userEmail?: string,
): RoleProfileData => {
  if (role === "seller") {
    const sellerOrders = orderData.slice(0, 4);
    return {
      name: userName || "Alex Mercator",
      email: userEmail || "seller@trustora.com",
      phone: "+1 (555) 872-4910",
      address: "108 Market Square, Suite 400, Chicago, IL 60601",
      memberSince: "January 2025",
      role: "seller",
      roleTitle: "Verified Merchant",
      roleBadge: "Merchant Seller",
      badgeType: "seller",
      avatar: "/assets/images/useFeedbackProfile2.png",
      notificationsEnabled: true,
      accountFields: [
        {
          label: "Merchant Name",
          value: userName || "Alex Mercator",
          icon: "lucide:store",
          badge: null,
        },
        {
          label: "Business Email",
          value: userEmail || "seller@trustora.com",
          icon: "lucide:mail",
          badge: {
            text: "Verified",
            icon: "lucide:check",
            className: "bg-success-surface text-success-icon border border-success-outline",
          },
        },
        {
          label: "Support Phone",
          value: "+1 (555) 872-4910",
          icon: "lucide:phone",
          badge: {
            text: "2FA Active",
            icon: "lucide:check",
            className: "bg-success-surface text-success-icon border border-success-outline",
          },
        },
        {
          label: "Fulfillment Origin",
          value: "Chicago Hub (USPS / FedEx Daily Pickup)",
          icon: "lucide:map-pin",
          badge: null,
        },
        {
          label: "Merchant Since",
          value: "January 2025 (24 Sales Fulfilled)",
          icon: "lucide:calendar",
          badge: null,
        },
        {
          label: "Payout Account",
          value: "Stripe Connect •••• 4242 (Instant Payouts)",
          icon: "lucide:credit-card",
          badge: {
            text: "Connected",
            icon: "lucide:check",
            className: "bg-escrow-surface text-escrow-foreground border border-escrow-outline",
          },
        },
      ],
      statsOverviewTitle: "Seller Performance",
      statsSubtitle: "Store Analytics",
      stats: [
        {
          label: "Active Listings",
          value: "8 Items",
          icon: "lucide:tag",
          color: "text-accent-default",
          bg: "bg-accent-surface",
        },
        {
          label: "Escrow Balance",
          value: "$3,345",
          icon: "lucide:shield-check",
          color: "text-escrow-icon",
          bg: "bg-escrow-surface",
        },
        {
          label: "Completed Sales",
          value: "24 Orders",
          icon: "lucide:check-circle-2",
          color: "text-success-icon",
          bg: "bg-success-surface",
        },
        {
          label: "Trust Rating",
          value: "4.9 ★",
          icon: "lucide:star",
          color: "text-amber-500",
          bg: "bg-amber-50",
        },
      ],
      escrowNotice: {
        title: "Seller Escrow Indemnity",
        description:
          "All incoming buyer funds are captured and held in escrow before you ship. Zero risk of chargebacks or fraudulent reversals.",
        icon: "lucide:shield-check",
      },
      verifications: [
        {
          title: "Merchant ID Verified",
          description: "Government identification and business registry confirmed",
          status: "Verified",
          isComplete: true,
          icon: "lucide:badge-check",
        },
        {
          title: "Stripe Payouts Connected",
          description: "Automated direct deposits upon delivery verification",
          status: "Active",
          isComplete: true,
          icon: "lucide:landmark",
        },
        {
          title: "Integrated Shipping",
          description: "USPS & FedEx automated milestone tracking verified",
          status: "Connected",
          isComplete: true,
          icon: "lucide:truck",
        },
        {
          title: "Chargeback Protection",
          description: "100% platform indemnification on verified deliveries",
          status: "Active",
          isComplete: true,
          icon: "lucide:shield",
        },
        {
          title: "Top Rated Seller",
          description: "4.9+ average rating across 20+ verified escrow orders",
          status: "Badge Awarded",
          isComplete: true,
          icon: "lucide:award",
        },
      ],
      verificationLevel: "Tier 1 Merchant",
      activities: [
        {
          id: "sel-act-1",
          title: "Funds Disbursed to Bank Account",
          description: "Buyer confirmed delivery for Leica M6. $1,245.00 transferred via Stripe.",
          date: "2026-08-14T11:15:00Z",
          orderNumber: "#HLD-2847",
          itemName: "Vintage Leica M6",
          type: "release",
        },
        {
          id: "sel-act-2",
          title: "Shipping Tracking Uploaded",
          description: "Item dispatched via USPS Priority Mail (9400111899223847652).",
          date: "2026-08-10T14:34:00Z",
          orderNumber: "#HLD-2847",
          itemName: "Vintage Leica M6",
          type: "shipping",
        },
        {
          id: "sel-act-3",
          title: "Escrow Payment Secured",
          description: "Buyer paid $2,115.00 for First Edition Dune. Funds safely in escrow.",
          date: "2026-08-08T10:20:00Z",
          orderNumber: "#HLD-2756",
          itemName: "First Edition Dune",
          type: "escrow",
        },
        {
          id: "sel-act-4",
          title: "New Marketplace Listing Created",
          description: "Rolex Submariner 16610 listed for $8,950.00 with Escrow Protection.",
          date: "2026-08-01T15:00:00Z",
          orderNumber: "#LST-104",
          itemName: "Rolex Submariner 16610",
          type: "escrow",
        },
      ],
      activitySubtitle: "Merchant Dispatch & Sales Log",
      recentOrdersTitle: "Recent Sales & Orders",
      recentOrdersSubtitle: "Orders from marketplace buyers",
      orders: sellerOrders,
      ordersViewAllLink: "/seller/dashboard",
      ordersViewAllLabel: "Manage Listings",
      quickActions: [
        {
          label: "Seller Dashboard",
          href: "/seller/dashboard",
          icon: "lucide:layout-dashboard",
          variant: "primary",
        },
        {
          label: "View All Orders",
          href: "/myorders",
          icon: "lucide:shopping-bag",
          variant: "secondary",
        },
      ],
    };
  }

  if (role === "admin") {
    const disputedOrders = orderData.filter(
      (o) => o.status === "Disputed" || o.status === "In Escrow" || o.status === "Held in Escrow",
    );
    const displayOrders = (disputedOrders.length > 0 ? disputedOrders : orderData).slice(0, 4);

    return {
      name: userName || "Test Admin",
      email: userEmail || "admin@trustora.com",
      phone: "+1 (555) 999-0144",
      address: "Trustora Trust & Safety Operations, Richmond, VA 23219",
      memberSince: "October 2024",
      role: "admin",
      roleTitle: "Platform Administrator",
      roleBadge: "Escrow Arbitrator",
      badgeType: "admin",
      avatar: "/assets/images/userFeedbackProfile3.png",
      notificationsEnabled: true,
      accountFields: [
        {
          label: "Administrator Name",
          value: userName || "Test Admin",
          icon: "lucide:user-cog",
          badge: null,
        },
        {
          label: "System Email",
          value: userEmail || "admin@trustora.com",
          icon: "lucide:mail",
          badge: {
            text: "Superuser",
            icon: "lucide:shield-alert",
            className: "bg-escrow-surface text-escrow-foreground border border-escrow-outline",
          },
        },
        {
          label: "Security Key",
          value: "Hardware YubiKey 2FA Enforced",
          icon: "lucide:key",
          badge: {
            text: "Active",
            icon: "lucide:check",
            className: "bg-success-surface text-success-icon border border-success-outline",
          },
        },
        {
          label: "Arbitration Desk",
          value: "Dispute Queue & Transaction Clearance",
          icon: "lucide:scale",
          badge: null,
        },
        {
          label: "Operational Clearance",
          value: "Level 4 Superuser (Full Platform Audit)",
          icon: "lucide:lock",
          badge: null,
        },
        {
          label: "Audit Authority",
          value: "Authorized for Fund Release & Buyer Refunds",
          icon: "lucide:file-check-2",
          badge: null,
        },
      ],
      statsOverviewTitle: "Platform Oversight",
      statsSubtitle: "Escrow & Dispute Metrics",
      stats: [
        {
          label: "Open Disputes",
          value: disputeData.length || 4,
          icon: "lucide:alert-triangle",
          color: "text-danger-icon",
          bg: "bg-danger-surface",
        },
        {
          label: "Pending Review",
          value: "2 Urgent",
          icon: "lucide:clock",
          color: "text-amber-500",
          bg: "bg-amber-50",
        },
        {
          label: "Cases Resolved",
          value: "148 Closed",
          icon: "lucide:check-check",
          color: "text-success-icon",
          bg: "bg-success-surface",
        },
        {
          label: "Escrow Volume",
          value: "$124.5k",
          icon: "lucide:shield",
          color: "text-escrow-icon",
          bg: "bg-escrow-surface",
        },
      ],
      escrowNotice: {
        title: "Platform Arbitrator Authority",
        description:
          "You have elevated permissions to review evidence, hold or release escrowed funds, and enforce binding resolutions on disputed transactions.",
        icon: "lucide:scale",
      },
      verifications: [
        {
          title: "Admin Superuser Authority",
          description: "Full access to transaction ledger and user permissions",
          status: "Authorized",
          isComplete: true,
          icon: "lucide:shield-alert",
        },
        {
          title: "Escrow Release Clearance",
          description: "Certified to release or refund funds up to $50,000",
          status: "Active",
          isComplete: true,
          icon: "lucide:check-circle-2",
        },
        {
          title: "Multi-Factor Hardware 2FA",
          description: "FIDO2 security token required for financial transactions",
          status: "Enforced",
          isComplete: true,
          icon: "lucide:key",
        },
        {
          title: "Immutable Audit Log",
          description: "All arbitration decisions signed and recorded to audit trail",
          status: "Active",
          isComplete: true,
          icon: "lucide:file-text",
        },
      ],
      verificationLevel: "Superuser Clearance",
      activities: [
        {
          id: "adm-act-1",
          title: "Arbitration Review Initiated",
          description: "Assigned to dispute #DSP-001 for Braun TP1 Radio. Reviewing buyer photos.",
          date: "2026-07-23T11:00:00Z",
          orderNumber: "#HLD-2654",
          itemName: "Braun TP1 Radio",
          type: "dispute",
        },
        {
          id: "adm-act-2",
          title: "Escrow Override Authorized",
          description: "Carrier confirmed delivery receipt for order #HLD-2847. Release approved.",
          date: "2026-08-14T09:30:00Z",
          orderNumber: "#HLD-2847",
          itemName: "Vintage Leica M6",
          type: "release",
        },
        {
          id: "adm-act-3",
          title: "Merchant Verified",
          description: "Completed business identity verification for merchant Alex Mercator.",
          date: "2026-08-01T14:15:00Z",
          orderNumber: "#USR-108",
          itemName: "Alex Mercator Store",
          type: "escrow",
        },
      ],
      activitySubtitle: "Platform Audit & Decision Trail",
      recentOrdersTitle: "Disputes & Escrow Queue",
      recentOrdersSubtitle: "Orders under observation or dispute",
      orders: displayOrders,
      ordersViewAllLink: "/admin/disputes",
      ordersViewAllLabel: "Dispute Queue",
      quickActions: [
        {
          label: "Dispute Queue",
          href: "/admin/disputes",
          icon: "lucide:scale",
          variant: "primary",
        },
        {
          label: "Admin Dashboard",
          href: "/admin/dashboard",
          icon: "lucide:bar-chart-3",
          variant: "secondary",
        },
      ],
    };
  }

  // Default: "user" (Buyer)
  return {
    name: userName || "Yousef Abdin",
    email: userEmail || "user@trustora.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield, VA 22150",
    memberSince: "March 2026",
    role: "user",
    roleTitle: "Verified Buyer",
    roleBadge: "Buyer · Escrow Protected",
    badgeType: "buyer",
    avatar: "/assets/images/img.png",
    notificationsEnabled: true,
    accountFields: [
      {
        label: "Full Name",
        value: userName || "Yousef Abdin",
        icon: "lucide:user",
        badge: null,
      },
      {
        label: "Email Address",
        value: userEmail || "user@trustora.com",
        icon: "lucide:mail",
        badge: {
          text: "Verified",
          icon: "lucide:check",
          className: "bg-success-surface text-success-icon border border-success-outline",
        },
      },
      {
        label: "Phone Number",
        value: "+1 (555) 234-5678",
        icon: "lucide:phone",
        badge: {
          text: "SMS Verified",
          icon: "lucide:check",
          className: "bg-success-surface text-success-icon border border-success-outline",
        },
      },
      {
        label: "Primary Delivery Address",
        value: "742 Evergreen Terrace, Springfield, VA 22150",
        icon: "lucide:map-pin",
        badge: null,
      },
      {
        label: "Member Since",
        value: "March 2026 (6 Orders Completed)",
        icon: "lucide:calendar",
        badge: null,
      },
      {
        label: "Account Standing",
        value: "Buyer & Marketplace Trader (Good Standing)",
        icon: "lucide:shield",
        badge: null,
      },
    ],
    statsOverviewTitle: "Marketplace Overview",
    statsSubtitle: "Buyer Activity",
    stats: [
      {
        label: "Total Orders",
        value: orderData.length || 6,
        icon: "lucide:package",
        color: "text-content-primary",
        bg: "bg-page-secondary",
      },
      {
        label: "In Escrow",
        value:
          orderData.filter(
            (o) =>
              o.status === "In Escrow" ||
              o.status === "Held in Escrow" ||
              o.status === "Shipped",
          ).length || 2,
        icon: "lucide:shield-alert",
        color: "text-escrow-icon",
        bg: "bg-escrow-surface",
      },
      {
        label: "Completed",
        value:
          orderData.filter(
            (o) =>
              o.status === "Completed" ||
              o.status === "Delivered" ||
              o.status === "Funds Released",
          ).length || 3,
        icon: "lucide:check-circle-2",
        color: "text-success-icon",
        bg: "bg-success-surface",
      },
      {
        label: "Disputes",
        value: orderData.filter((o) => o.status === "Disputed").length || 1,
        icon: "lucide:alert-triangle",
        color: "text-danger-icon",
        bg: "bg-danger-surface",
      },
    ],
    escrowNotice: {
      title: "Trustora Escrow Guarantee",
      description:
        "Your payments are locked safely in escrow and only released after delivery inspection or confirmation.",
      icon: "lucide:shield-check",
    },
    verifications: [
      {
        title: "Email Verified",
        description: "Confirmed on account creation",
        status: "Verified",
        isComplete: true,
        icon: "lucide:mail-check",
      },
      {
        title: "Phone Verified",
        description: "SMS authentication enabled for escrow security",
        status: "Verified",
        isComplete: true,
        icon: "lucide:phone-call",
      },
      {
        title: "2-Factor Authentication",
        description: "Active protection for payout releases",
        status: "Active",
        isComplete: true,
        icon: "lucide:shield-check",
      },
      {
        title: "Escrow Standing",
        description: "Zero dispute penalties · 100% on-time release record",
        status: "Good Standing",
        isComplete: true,
        icon: "lucide:award",
      },
      {
        title: "Government ID",
        description: "Optional Tier 2 verification for orders over $5,000",
        status: "Optional",
        isComplete: false,
        icon: "lucide:file-badge",
      },
    ],
    verificationLevel: "Level 1 Verified",
    activities: [
      {
        id: "act-1",
        title: "Package Delivered & Inspection Started",
        description: "Delivered to mailbox. 48-hour escrow inspection period initiated.",
        date: "2026-08-12T11:15:00Z",
        orderNumber: "#HLD-2847",
        itemName: "Vintage Leica M6",
        type: "delivery",
      },
      {
        id: "act-2",
        title: "Item Shipped by Seller",
        description: "Seller shipped via USPS Priority Mail (Tracking #9400111899223847652).",
        date: "2026-08-10T14:34:00Z",
        orderNumber: "#HLD-2847",
        itemName: "Vintage Leica M6",
        type: "shipping",
      },
      {
        id: "act-3",
        title: "Funds Released to Seller",
        description: "Buyer authenticated print and finalized transaction. Escrow released.",
        date: "2026-08-02T10:00:00Z",
        orderNumber: "#HLD-2756",
        itemName: "First Edition Dune",
        type: "release",
      },
      {
        id: "act-4",
        title: "Payment Held in Escrow",
        description: "Funds locked securely in Holdline smart contract.",
        date: "2026-07-29T09:15:00Z",
        orderNumber: "#HLD-2756",
        itemName: "First Edition Dune",
        type: "escrow",
      },
      {
        id: "act-5",
        title: "Dispute Opened by Buyer",
        description: "Escrow funds locked pending arbitration review for cosmetic imperfection.",
        date: "2026-07-22T09:15:00Z",
        orderNumber: "#HLD-2654",
        itemName: "Braun TP1 Radio",
        type: "dispute",
      },
    ],
    activitySubtitle: "Marketplace Log",
    recentOrdersTitle: "Recent Orders",
    recentOrdersSubtitle: "Items you've purchased",
    orders: orderData.slice(0, 4),
    ordersViewAllLink: "/myorders",
    ordersViewAllLabel: "View all",
    quickActions: [
      {
        label: "Browse Marketplace",
        href: "/browse",
        icon: "lucide:shopping-cart",
        variant: "primary",
      },
      {
        label: "My Orders",
        href: "/myorders",
        icon: "lucide:package",
        variant: "secondary",
      },
    ],
  };
};
