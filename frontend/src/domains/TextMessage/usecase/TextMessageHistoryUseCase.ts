import { GetHistoryInput, GetHistoryOutput, TextMessageHistoryRepository } from "../repotisories/TextMessageHistoryRepository";

// UseCaseの返答型（UI用の状態を追加）
export type GetHistoryUseCaseResult = {
  data: GetHistoryOutput;
  isLoading: boolean;
};

export interface TextMessageHistoryUseCase {
  getMessageHistory: (input: GetHistoryInput) => Promise<GetHistoryUseCaseResult>;
}

export const createTextMessageHistoryUseCase = (repo: TextMessageHistoryRepository): TextMessageHistoryUseCase => {
  return {
    getMessageHistory: async (input: GetHistoryInput) => {
      const data = await repo.getHistory(input);
      if(!data) {
        return { 
          data: { 
            messages: [], 
            nextBeforeSentAt: '0', 
            hasNext: false 
          } , 
          isLoading: true
        } as GetHistoryUseCaseResult
      }
      else {
        return { 
          data: data, 
          isLoading: false 
        } as GetHistoryUseCaseResult
      }
    }
  };
};