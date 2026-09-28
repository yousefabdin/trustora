import type {
  LoginCredentials,
  LoginResponse,
  MockUser,
  User,
} from "@/types/auth";
import { MockUsers } from "@/utils/userSeed";
type RegisterCredentials = Pick<MockUser, "name" | "email" | "password">;
const AUTH_TOKEN_KEY = "auth_token";

const createMockToken = (user: User): string => {
  const header = {
    alg: "none",
    typ: "JWT",
  };
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  const encode = (value: object) =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  return `${encode(header)}.${encode(payload)}.mock-signature`;
};

export const register = async ({
  name,
  email,
  password,
}: RegisterCredentials): Promise<LoginResponse> => {
  const normalizedEmail = email.trim().toLocaleLowerCase();
  const existingUser = MockUsers.find(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );
  if (existingUser) throw new Error("Email is Already Register");
  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    password,
    email: normalizedEmail,
    role: "user",
  };
  MockUsers.push(newUser);
  return login({ password, email: normalizedEmail });
};
export const login = async ({
  email,
  password,
}: LoginCredentials): Promise<LoginResponse> => {
  const user = MockUsers.find(
    (user) => user.email === email && user.password === password,
  );
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const authenticatedUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = createMockToken(authenticatedUser);

  sessionStorage.setItem(AUTH_TOKEN_KEY, accessToken);

  return {
    user: authenticatedUser,
    accessToken,
  };
};
export const logout = (): void => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};
export const getToken = (): string | null => {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
};

export const decodeMockToken = (accessToken: string): User | null => {
  try {
    const payload = accessToken.split(".")[1];

    if (!payload) {
      return null;
    }

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );

    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: decodedPayload.sub,
      name: decodedPayload.name,
      email: decodedPayload.email,
      role: decodedPayload.role,
    };
  } catch {
    return null;
  }
};
export const getCurrentUser = (): User | null => {
  const token = getToken();

  if (!token) {
    return null;
  }

  return decodeMockToken(token);
};
