import { createContext, useState } from "react";
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

  const textMessageHistoryRepo = createTextMessageHistoryRepository();
  const textMessageHistoryUseCase = createTextMessageHistoryUseCase(textMessageHistoryRepo);

  // UseCaseがステートに関われるようにラップ
  const usecase = {
    history: {
      getMessageHistory(input) {
        return textMessageHistoryUseCase.getMessageHistory(input)
          .then((messages) => {
            setComments(messages.data.messages);
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