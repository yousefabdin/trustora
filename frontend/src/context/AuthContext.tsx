import {
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
  Children,
} from "react";
import { showToast } from "@/components/molecules/toast/Toast";

import { getApiErrorMessage } from "@/apis/axios";

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
import type { LoginCredentials, LoginResponse, User } from "@/types/auth";
import * as authService from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (credentials: RegisterCredentials) => Promise<User>;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const restoreSession = async (isMounted) => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (isMounted) {
        setUser(currentUser);
      }
    } catch {
      if (isMounted) {
        setUser(null);
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    let isMounted = true;

    restoreSession(isMounted);

    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    try {
      const newUser = await authService.register(credentials);
      setUser(newUser);
      showToast({
        variant: "success",
        message: `Registration successful! Welcome, ${newUser.name}`,
      });
      return newUser;
    } catch (error) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(error, "Registration failed"),
      });
      throw error;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      const authenticatedUser = await authService.login(credentials);
      setUser(authenticatedUser);
      showToast({
        variant: "success",
        message: `Welcome back, ${authenticatedUser.name}!`,
      });
      return authenticatedUser;
    } catch (error) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(error, "Invalid email or password"),
      });
      throw error;
    }
  };
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      showToast({
        variant: "info",
        message: "You have been logged out.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
