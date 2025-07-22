import { ICEMessage, SDPMessage, TextMessage } from "../../TextMessage/models/TextMessage";

// Socketから流れる、あるいは送るメッセージのハブとしての役割
export type Message = {
  message_type: 'text' | 'sdp' | 'ice';
  payload: TextMessage | SDPMessage | ICEMessage;
}