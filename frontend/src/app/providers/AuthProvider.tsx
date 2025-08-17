import React, { createContext, useState, useEffect } from "react";
import { User } from "../../domains/user/models/User"
import { createUserUseCase, UserUseCase } from "../../domains/user/usecases/UserUseCase";
import { createUserRepository } from "../../infrastructure/api/UserRepositoryImpl";

type AuthContextValue = {
  user: User | null;
  usecase: UserUseCase;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const userRepo = createUserRepository();
  const baseUsecase = createUserUseCase(userRepo);

  // UseCaseがステートに関われるようにラップ
  const usecase: UserUseCase = {
    async login(input) {
      const user = await baseUsecase.login(input);
      setUser(user);
      return user;
    },
    async register(input) {
      const user = await baseUsecase.register(input);
      setUser(user);
      return user;
    },
    async logout() {
      await baseUsecase.logout();
      setUser(null);
      return null;
    },
    async getMe() {
      const user = await baseUsecase.getMe();
      setUser(user);
      return user;
    }
  };

  // 初回ログイン確認
  useEffect(() => {
    baseUsecase.getMe()
      .then(setUser)
      .catch(() => { });
  }, []);

  return (
    <AuthContext.Provider value={{ user, usecase } as AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}