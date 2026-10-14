import api, { setAccessToken } from "@/apis/axios";

import type {
  AuthResponse,
  BackendUserResponse,
  LoginCredentials,
  MockUser,
  User,
} from "@/types/auth";
type RegisterCredentials = Pick<MockUser, "name" | "email" | "password">;
const AUTH_TOKEN_KEY = "auth_token";

export const getStoredUserProfile = (userId: string): Partial<User> => {
  try {
    const raw = localStorage.getItem(`trustora_user_profile_${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveStoredUserProfile = (userId: string, data: Partial<User>) => {
  try {
    const existing = getStoredUserProfile(userId);
    localStorage.setItem(
      `trustora_user_profile_${userId}`,
      JSON.stringify({ ...existing, ...data }),
    );
  } catch {
    // ignore storage errors
  }
};

export const adaptUser = (backendUser: BackendUserResponse): User => {
  const roles = backendUser.roles || [];
  let primaryRole: User["role"] = "user";
  if (roles.includes("admin")) {
    primaryRole = "admin";
  }
  const namePart = backendUser.email.split("@")[0] || "User";
  const defaultDisplayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  const stored = getStoredUserProfile(backendUser.id);

  return {
    id: backendUser.id,
    email: backendUser.email,
    name: stored.name || backendUser.name || defaultDisplayName,
    role: primaryRole,
    roles,
    avatarUrl: stored.avatarUrl || backendUser.avatarUrl,
    phone: stored.phone || backendUser.phone || "+1 (555) 234-5678",
    address: stored.address || backendUser.address || "742 Evergreen Terrace, Springfield, VA 22150",
    bio: stored.bio || backendUser.bio || "Active Trustora buyer & verified trader.",
    memberSince: stored.memberSince || backendUser.memberSince || "March 2026",
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
