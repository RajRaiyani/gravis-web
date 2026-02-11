"use client";

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";

import type { AuthUser } from "@/types/user.type";
import Cookies from "js-cookie";

export interface AuthContextType {
  authUser: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (AuthUser: AuthUser, token: string, expiresAt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedUser = Cookies.get("user");
      const storedToken = Cookies.get("token");

      if (storedUser) {
        setAuthUser(JSON.parse(storedUser) as AuthUser);
      }
      if (storedToken) {
        setToken(storedToken);
      }
    } catch {
      // Ignore malformed cookies
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const isLoggedIn = authUser !== null;

  function login(AuthUser: AuthUser, token: string, expiresAt: string) {
    Cookies.set("user", JSON.stringify(AuthUser), {
      expires: new Date(expiresAt),
    });
    Cookies.set("token", token, { expires: new Date(expiresAt) });
    setAuthUser(AuthUser);
    setToken(token);
  }

  function logout() {
    Cookies.remove("user");
    Cookies.remove("token");
    setAuthUser(null);
    setToken(null);
  }

  const value: AuthContextType = {
    authUser,
    token,
    isLoggedIn,
    isHydrated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
