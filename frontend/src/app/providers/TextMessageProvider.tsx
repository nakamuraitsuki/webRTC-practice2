import { createContext, useRef, useState } from "react";
import { TextMessage } from "../../domains/TextMessage/models/TextMessage";
import { TextMessageHistoryUseCase } from "../../domains/TextMessage/usecase/TextMessageHistoryUseCase";
import { createTextMessageHistoryUseCase } from "../../domains/message/usecase/TextMessageHistoryUseCase";
import { createTextMessageHistoryRepository } from "../../infrastructure/api/TextMessageHistoryRepositoryImpl";

type TextMessageContextValue = {
  comments: TextMessage[];
  usecase: {
    history: TextMessageHistoryUseCase;
  };
};

export const TextMessageContext = createContext<TextMessageContextValue | undefined>(undefined);

export const TextMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [comments, setComments] = useState<TextMessage[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());

  const textMessageHistoryRepo = createTextMessageHistoryRepository();
  const textMessageHistoryUseCase = createTextMessageHistoryUseCase(textMessageHistoryRepo);

  // UseCaseがステートに関われるようにラップ
  const usecase = {
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
  }

  return (
    <TextMessageContext.Provider value={{ comments, usecase: usecase }}>
      {children}
    </TextMessageContext.Provider>
  );
};