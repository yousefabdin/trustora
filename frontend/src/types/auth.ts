export type UserRole = "user" | "admin" | "seller";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
export interface MockUser extends User {
  password: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}
