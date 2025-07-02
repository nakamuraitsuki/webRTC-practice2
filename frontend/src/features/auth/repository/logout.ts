import apiClient from "../../utils/apiClient";

// ユーザーログアウトの処理を行う関数
// userRepositoryImpl.ts でimport されて、具体実装に利用される
export const Logout = async (): Promise<void> => {
  const res = await apiClient.post("/api/user/logout", null);

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "ログアウトに失敗しました");
  }
};
