import { CreateRoom } from "./createRoomApi";
import { GetAllRooms } from "./getAllRoomsApi";
import { RoomRepository } from "./roomRepository";

export const RoomRepo: RoomRepository = {
  createRoom: CreateRoom,
  getAllRooms: GetAllRooms
}