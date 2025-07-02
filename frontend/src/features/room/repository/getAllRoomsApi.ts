import apiClient from "../../utils/apiClient"
import { Room } from "../models/room";

export const GetAllRooms = async () => {
  const response = await apiClient.get("/api/room");
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ルームの取得に失敗しました");
  }

  const data = await response.json();
  const res: Room[] = data.map((room: any) => ({
    id: room.room_id,
    name: room.name,
    members: room.members || [] // メンバー情報がない場合は空の配列を設定
  }))
  return res;
}