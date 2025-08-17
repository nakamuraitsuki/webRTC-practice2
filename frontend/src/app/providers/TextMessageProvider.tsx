import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { TextMessage } from "../../domains/TextMessage/models/TextMessage";
import { TextMessageHistoryUseCase } from "../../domains/TextMessage/usecase/TextMessageHistoryUseCase";
import { createTextMessageHistoryUseCase } from "../../domains/message/usecase/TextMessageHistoryUseCase";
import { createTextMessageHistoryRepository } from "../../infrastructure/api/TextMessageHistoryRepositoryImpl";
import { useSocket } from "../hooks/useSocket";
import { createTextMessageLiveUseCase, TextMessageLiveUseCase } from "../../domains/TextMessage/usecase/TextMessageLiveUseCase";

type TextMessageContextValue = {
  comments: TextMessage[];
  usecase: {
    history: TextMessageHistoryUseCase;
    live: TextMessageLiveUseCase;
  };
};

export const TextMessageContext = createContext<TextMessageContextValue | undefined>(undefined);

export const TextMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [comments, setComments] = useState<TextMessage[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const socketService  = useSocket();

  const textMessageHistoryRepo = createTextMessageHistoryRepository();
  const textMessageHistoryUseCase = createTextMessageHistoryUseCase(textMessageHistoryRepo);
  const textMessageLiveUseCase = createTextMessageLiveUseCase(socketService);

  // UseCaseがステートに関われるようにラップ（useMemoで安定化）
  const usecase = useMemo(() => ({
    history: {
      async getMessageHistory(input) {
        return textMessageHistoryUseCase.getMessageHistory(input)
          .then((messages) => {
            // 追加すべきMessageの抽出
            const newMessages: TextMessage[] = [];
            messages.data.messages.forEach(msg => {
              if (!seenIdsRef.current.has(msg.id)) {
                // setに追加
                seenIdsRef.current.add(msg.id);
                newMessages.push(msg);
              }
            });
            
            // sort
            newMessages.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());

            // メッセージを配列の後ろに追加
            setComments((prev) => [...prev, ...newMessages]);
            return messages;
          })
          .catch(() => {
            setComments([]);
            return [];
          });
      },
    }as TextMessageHistoryUseCase,
  
    live: {
      sendMessage: textMessageLiveUseCase.sendMessage,
      receiveMessage: async (payload: TextMessage) => {
        // メッセージを配列の前に追加
        setComments((prev) => [payload, ...prev]);
        // seenIdsに追加
        seenIdsRef.current.add(payload.id);
      }
    }
  }), [textMessageHistoryUseCase, textMessageLiveUseCase]);


  // ソケットのメッセージ受信イベントを登録（render時に一度だけ）
  useEffect(() => {
    socketService.onMessage("text", usecase.live.receiveMessage);

    return () => {
      socketService.offMessage("text");
    };
  }, [socketService]);

  return (
    <TextMessageContext.Provider value={{ comments, usecase: usecase }}>
      {children}
    </TextMessageContext.Provider>
  );
};