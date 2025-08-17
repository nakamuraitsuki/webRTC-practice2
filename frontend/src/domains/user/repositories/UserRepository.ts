import { User } from "../models/User";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

// User の外部通信のインターフェース
export interface UserRepository {
  // register : バックエンドにリクエスト。cookieにトークンをセットしてもらう。
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  me: () => Promise<User>;
}