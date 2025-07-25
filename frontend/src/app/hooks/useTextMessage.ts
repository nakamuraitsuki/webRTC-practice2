import { useContext, useEffect } from "react"
import { TextMessageContext } from "../providers/TextMessageProvider"
import { GetHistoryInput } from "../../domains/TextMessage/repotisories/TextMessageHistoryRepository";

export const useTextMessage = (roomId: string) => {
  const context = useContext(TextMessageContext);
  if (!context) {
    throw new Error("useTextMessage must be used within a TextMessageProvider");
  }

  const input: GetHistoryInput = {
    roomId: roomId,
    limit: 10,
    beforeSentAt: new Date().toISOString(),
  };
  useEffect(() => {
    context.usecase.history.getMessageHistory(input)
  },[roomId]);

  return context;
}