import apiClient from "../../utils/apiClient";
import { LoginParams } from "./userRepository";

// ユーザーログインの処理を行う関数
// userRepositoryImpl.ts でimport されて、具体実装に利用される
export const Login = async ({ data, refetch }: LoginParams): Promise<void> => {
  try {
    const res = await apiClient.post("/api/user/login", data);
    console.log(res);

    // ここではaxiosのレスポンスデータを直接利用できます
    if (res.ok) {
      // 成功時の処理
      refetch();  // 認証情報の更新
    } else {
      throw new Error("ログインに失敗しました");
    }
  } catch (error: any) {
    // エラーハンドリング
    throw new Error(error.response?.data?.message || "ログインに失敗しました");
  }
};
