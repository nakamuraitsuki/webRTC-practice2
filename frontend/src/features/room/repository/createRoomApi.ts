import apiClient from "../../utils/apiClient"
import { CreateRoomParams } from "./roomRepository";

export const CreateRoom = async (data : CreateRoomParams) => {
  const response = await apiClient.post("/api/room", data);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "ルームの作成に失敗しました");
  }
}