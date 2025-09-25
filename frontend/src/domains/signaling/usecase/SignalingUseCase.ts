import { Message } from "../../message/models/Message";
import { RTCService } from "../../services/rtcService";
import { SocketService } from "../../services/socketService";
import { ICEMessage, SDPMessage } from "../models/models";

export type JoinRoomInput = {
  room_id: string; // ルームID
  user_id: string; // ユーザーID
};

export interface SignalingUseCase {
  // ルームに参加する
  joinRoom: (input: JoinRoomInput) => Promise<void>;

  // ルームから退出する
  leaveRoom: () => Promise<void>;

  // 送られてきたオファー、アンサー、ICE候補の処理
  handleSDP: (msg: SDPMessage, selfUserId: string) => Promise<void>;
  handleICECandidate: (msg: ICEMessage) => Promise<void>;

  // listenerに登録する用のsendICECandidate
  sendICECandidate: (candidate: RTCIceCandidate) => void;
}

export const createSignalingUseCase = (
  socket: SocketService,
  rtc: RTCService
): SignalingUseCase => {
  return {
    joinRoom: async (input: JoinRoomInput): Promise<void> => {
      // offerの作成
      const offer: RTCSessionDescriptionInit = await rtc.createOffer();

      // offerの組み立て
      const message: Message<'sdp'> = {
        message_type: 'sdp',
        payload: {
          sdp_type: 'offer',
          sdp: offer.sdp || '',
          from: input.user_id,
          room_id: input.room_id,
        }
      }

      // offerの送信
      socket.send(message);
    },

    leaveRoom: async (): Promise<void> => {
      rtc.closeConnection();
      socket.disconnect();
    },

    handleSDP: async (msg: SDPMessage, selfUserId: string): Promise<void> => {
      if (msg.sdp_type === 'offer') {
        // 受信したOfferに応答する
        if( msg.from === selfUserId ) {
          // 自分からのOfferは無視
          return;
        }
        const answer: RTCSessionDescriptionInit = await rtc.respondToOffer({
          type: 'offer',
          sdp: msg.sdp,
        })
        // Answerの組み立て
        const answerMessage: Message<'sdp'> = {
          message_type: 'sdp',
          payload: {
            sdp_type: 'answer',
            sdp: answer.sdp || '',
            from: selfUserId,
            to: msg.from,
            room_id: msg.room_id,
          }
        }
        // Answerの送信
        socket.send(answerMessage);
      } else if (msg.sdp_type === 'answer') {
        // 受信したAnswerを適用する
        if( msg.to !== selfUserId ) {
          // 自分宛てのAnswerでなければ無視
          return;
        }
        await rtc.applyRemoteAnswer({
          type: 'answer',
          sdp: msg.sdp || '',
        });
      } else {
        throw new Error('Unknown SDP type');
      }
    },

    handleICECandidate: async (msg: ICEMessage): Promise<void> => {
      await rtc.addRemoteIceCandidate({
        candidate: msg.candidate,
        sdpMid: msg.sdp_mid,
        sdpMLineIndex: msg.sdp_mline_index,
      });
    },

    /**
     * listenerに登録する用のsendICECandidate。hook内で上書きして使う
     * @param candidate RTCIceCandidate
     */
    sendICECandidate: (_candidate: RTCIceCandidate) => {
      // No-op: This function is intentionally left blank and is expected to be overridden in a hook.
    }
  }
}