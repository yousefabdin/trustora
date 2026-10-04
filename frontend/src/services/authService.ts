import api, { setAccessToken } from "@/apis/axios";

import type {
  AuthResponse,
  BackendUserResponse,
  LoginCredentials,
  LoginResponse,
  MockUser,
  User,
} from "@/types/auth";
type RegisterCredentials = Pick<MockUser, "name" | "email" | "password">;
const AUTH_TOKEN_KEY = "auth_token";

export const adaptUser = (backendUser: BackendUserResponse): User => {
  const roles = backendUser.roles || [];
  let primaryRole: User["role"] = "user";
  if (roles.includes("admin")) {
    primaryRole = "admin";
  }
  const namePart = backendUser.email.split("@")[0] || "User";
  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  return {
    id: backendUser.id,
    email: backendUser.email,
    name: displayName,
    role: primaryRole,
    roles,
  };
};

export const register = async (
  credentials: RegisterCredentials,
): Promise<User> => {
  const response = await api.post<AuthResponse>("/auth/signup", {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
    roles: ["buyer", "seller"],
  });
  const { user, accessToken } = response.data;

  setAccessToken(accessToken);

  return adaptUser(user);
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    email: credentials.email.trim().toLowerCase(),
    password: credentials.password,
  });
  const { user, accessToken } = response.data;
  setAccessToken(accessToken);
  return adaptUser(user);
};
export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
};
export const getToken = (): string | null => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const refreshRes = await api.post<{ accessToken: string }>("/auth/refresh");
    const token = refreshRes.data.accessToken;
    setAccessToken(token);

    const meRes = await api.get<BackendUserResponse>("/me");
    return adaptUser(meRes.data);
  } catch {
    setAccessToken(null);
    return null;
  }
};
