import apiClient from "../../utils/apiClient";
import { RegisterParams } from "./userRepository";

// ユーザー登録の処理を行う関数
// userRepositoryImpl.ts でimport されて、具体実装に利用される
export const Register = async ({data, refetch}: RegisterParams): Promise<void> => {
  const res = await apiClient.post("/api/user/register", data);
  if (res.ok) {
    refetch();
  }
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "登録に失敗しました");
  }
};
