import { TextMessage } from "../models/TextMessage";

export type GetHistoryInput = {
  roomId: string;
  limit?: number;
  beforeSentAt?: string; // RFC3339形式
};

export type GetHistoryOutput = {
  messages: TextMessage[];
  nextBeforeSentAt: string;
  hasNext: boolean;
};

export interface TextMessageHistoryRepository {
  getHistory: (input: GetHistoryInput) => Promise<GetHistoryOutput>;
}