import { Room } from "../models/Room";

export type CreateRoomInput = {
  name: string;
}

export interface RoomRepository {
  create: (params: CreateRoomInput) => Promise<void>;
  getAll: () => Promise<Room[]>;
}