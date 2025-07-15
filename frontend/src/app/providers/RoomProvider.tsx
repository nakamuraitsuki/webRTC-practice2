import { createContext, ReactNode, useEffect, useState } from "react";
import { Room } from "../../domains/room/models/Room";
import { createRoomUseCase, RoomUseCase } from "../../domains/room/usecase/RoomUseCase";
import { createRoomRepository } from "../../infrastructure/api/RoomRepositoryImpl";

type RoomContextValue = {
  rooms: Room[];
  usecase: RoomUseCase
}

export const RoomContext = createContext<RoomContextValue | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode}) => {
  const [rooms, setRooms] = useState<Room[] | null>(null);

  const roomRepo = createRoomRepository();
  const baseUsecase = createRoomUseCase(roomRepo);

  // UseCaseがステートに関われるようにラップ
  const usecase: RoomUseCase = {
    async createRoom(input) {
      await baseUsecase.createRoom(input);
      // ルーム作成後に全ルームを再取得
      const allRooms = await baseUsecase.getAllRooms();
      setRooms(allRooms);
    },
    async getAllRooms() {
      const allRooms = await baseUsecase.getAllRooms();
      setRooms(allRooms);
      return allRooms;
    }
  };

  // 初回ルーム取得
  useEffect(() => {
    baseUsecase.getAllRooms()
      .then(setRooms)
      .catch(() => {
        setRooms([]);
      });
  }, []);
  
  return (
    <RoomContext.Provider value={{ rooms, usecase } as RoomContextValue}>
      {children}
    </RoomContext.Provider>
  )
}