import { createContext, useEffect, useState, ReactNode } from "react";
import { User } from "../models"; 
import apiClient from "../utils/apiClient"; 

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refetch: () => void;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // GetMe の API を叩いて、ログイン状況確認
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser, setUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
