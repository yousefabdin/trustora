import type { MockUser } from "@/types/auth";
export const MockUsers: MockUser[] = [
  {
    id: "user-001",
    name: "Test User",
    email: "user@test.com",
    password: "User123!",
    role: "user",
  },
  {
    id: "seller-001",
    name: "Test Seller",
    email: "seller@test.com",
    password: "Seller123!",
    role: "seller",
  },
  {
    id: "admin-001",
    name: "Test Admin",
    email: "admin@test.com",
    password: "Admin123!",
    role: "admin",
  },
];
