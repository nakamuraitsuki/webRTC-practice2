import { Login } from "./login";
import { Logout } from "./logout";
import { Register } from "./register";
import { UserRepository } from "./userRepository";

// 具体実装を注入。インターフェースは./userRepository.tsに定義
export const UserRepo: UserRepository = {
  register: Register,
  login: Login,
  logout: Logout
}