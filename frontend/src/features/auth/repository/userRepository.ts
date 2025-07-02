import { LoginFormData, RegisterFormData } from "../types";

export type RegisterParams = {
  data: RegisterFormData;
  refetch: () => void;
};

export type LoginParams = {
  data: LoginFormData;
  refetch: () => void;
}

// User関連の情報のやり取りをするインターフェース定義
// 具体実装は./userRepositoryImpl.tsで決められている
export type UserRepository = {
  register: (params: RegisterParams) => Promise<void>;
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
}