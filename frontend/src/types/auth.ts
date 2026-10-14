export type UserRole = "user" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles: string[];
  avatarUrl?: string;
  phone?: string;
  address?: string;
  bio?: string;
  memberSince?: string;
}
export interface BackendUserResponse {
  id: string;
  email: string;
  roles: string[];
  name?: string;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  bio?: string;
  memberSince?: string;
}
export interface MockUser extends User {
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
export interface AuthResponse {
  user: BackendUserResponse;
  accessToken: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}
