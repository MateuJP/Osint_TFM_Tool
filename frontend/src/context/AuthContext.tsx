// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "../api/client";

interface User {
  nombre: string;
  apikey?: string | null;
  modo?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (username: string, password: string) => {
    const res = await api.post("/user/login", { username, password });
    const tokenValue = res.data?.access_token || res.data?.token;

    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);

    // obtener usuario actual
    const me = await api.get("/user/me");
    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
