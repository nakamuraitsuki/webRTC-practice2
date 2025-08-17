import { User } from "../models/User";
import { LoginInput, RegisterInput, UserRepository } from "../repositories/UserRepository";

export interface UserUseCase {
  login(input: LoginInput): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(): Promise<null>;
  getMe(): Promise<User>;
}

export const createUserUseCase = (repo: UserRepository): UserUseCase => {
  return {
    async login(input: LoginInput): Promise<User> {
      await repo.login(input);
      return repo.me();
    },
    async register(input: RegisterInput): Promise<User> {
      await repo.register(input);
      return repo.me();
    },
    async logout(): Promise<null> {
      await repo.logout();
      return null;
    },
    async getMe(): Promise<User> {
      return repo.me();
    }
  }
}