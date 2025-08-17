import { Room } from "../../domains/room/models/Room";
import { CreateRoomInput, RoomRepository } from "../../domains/room/repositories/RoomRepository";
import { apiClient } from "./apiClient";

export const createRoomRepository = (): RoomRepository => {
  return {
    // ルーム作成
    async create(input: CreateRoomInput): Promise<void> {
      await apiClient.post<CreateRoomInput, void>("/api/room", input);
    },

    // 全ルーム取得
    async getAll(): Promise<Room[]> {
      return apiClient.get<Room[]>("/api/room");
    }
  };
}