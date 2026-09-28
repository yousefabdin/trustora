import {
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
  Children,
} from "react";
import { showToast } from "@/components/molecules/toast/Toast";
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
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();

    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const register = async (
    credentials: RegisterCredentials,
  ): Promise<LoginResponse> => {
    const response = await authService.register(credentials);

    setUser(response.user);

    showToast({
      variant: "success",
      message: `Registration Successful, Welcome ${response.user.name}`,
    });
    return response.user;
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);

    setUser(response.user);
    showToast({
      variant: "success",
      message: `Login Successfull , Welcome Back ${user?.name}`,
    });
    return response.user;
  };
  const logout = () => {
    authService.logout();
    setUser(null);

    showToast({
      variant: "success",
      message: `logout Successfull , Goodbye ${user?.name}`,
    });
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
