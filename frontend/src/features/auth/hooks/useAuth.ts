import { useContext } from "react";
import { AuthContext } from "../../../privider";
import { UserRepo } from "../repository/userRepositoryImpl";

// AuthProvider を使用＋ Logout API を使用するためのカスタムフック
// GetMe と Logout が使える
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  const logout = async () => {
    await UserRepo.logout();          // API呼び出し
    context.setUser(null);   // Providerの状態クリア
  };

  return {
    user: context.user,
    loading: context.loading,
    refetch: context.refetch,
    logout,
  };
};
