import { User } from "../../domains/user/models/User";
import { UserRepository, LoginInput, RegisterInput } from "../../domains/user/repositories/UserRepository";
import { apiClient } from "./apiClient";

export const createUserRepository = ():UserRepository => {
  return {
    // ユーザー登録とクッキーにトークンセット
    async register(input: RegisterInput): Promise<void> {
      await apiClient.post<RegisterInput, void>("/api/user/register", input);
    },
  
    // ログイン（クッキーにトークンセット）
    async login(input: LoginInput): Promise<void> {
      await apiClient.post<LoginInput, void>("/api/user/login", input);
    },
  
    // ログアウト（クッキーのトークン削除）
    async logout(): Promise<void> {
      await apiClient.post<null, void>("/api/user/logout", null);
    },
  
    // ユーザー情報取得（クッキーのトークンを使用）
    async me(): Promise<User> {
      return apiClient.get<User>("/api/user/me");
    }
  }
}
