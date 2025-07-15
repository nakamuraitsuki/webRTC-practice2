import { Room } from "../models/Room";
import { CreateRoomInput, RoomRepository } from "../repositories/RoomRepository";

export interface RoomUseCase {
  createRoom: (input:CreateRoomInput) => Promise<void>;
  getAllRooms: () => Promise<Room[]>;
}

export const createRoomUseCase = (repo: RoomRepository): RoomUseCase => {
  return {
    createRoom: async (input: CreateRoomInput) => {
      await repo.create(input);
    },
    getAllRooms: async () => {
      const data = await repo.getAll();
      if(!data) {
        return [];
      }
      else {
        return data;
      }
    }
  };
}