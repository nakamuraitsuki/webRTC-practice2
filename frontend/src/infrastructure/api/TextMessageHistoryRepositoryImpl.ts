import { GetHistoryInput, GetHistoryOutput } from "../../domains/TextMessage/repotisories/TextMessageHistoryRepository"
import { apiClient } from "./apiClient"

export const createTextMessageHistoryRepository = () => {
  return {
    // Comment の履歴取得
    async getMessageHistory(input: GetHistoryInput): Promise<GetHistoryOutput> {
      return await apiClient.get<GetHistoryOutput>(
        `/api/message/${input.roomId}?limit=${input.limit}&before_sent_at=${input.beforeSentAt}`
      );
    }
  }
}