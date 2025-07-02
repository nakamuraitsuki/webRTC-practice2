import { Room } from '../models/room';

export type CreateRoomParams = {
  name: string;
};

// Room関係の操作インターフェース定義
export type RoomRepository = {
  createRoom: (params: CreateRoomParams) => Promise<void>;
  getAllRooms: () => Promise<Room[]>;
}