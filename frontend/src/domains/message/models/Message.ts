import { TextMessage } from "../../TextMessage/models/TextMessage";
import { SDPMessage, ICEMessage } from "../../signaling/models/models"; 

export type MessageTypeMap = {
  'text': TextMessage;
  'sdp': SDPMessage;
  'ice': ICEMessage;
}

// 抽象的に扱いたい場合があるのでデフォルト keyof MessageTypeMap
export type Message<T extends keyof MessageTypeMap = keyof MessageTypeMap> = {
  message_type: T;
  payload: MessageTypeMap[T];
};
