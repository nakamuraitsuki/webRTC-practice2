import { Message } from "../../message/models/Message";
import { RTCService } from "../../services/rtcService";
import { SocketService } from "../../services/socketService";
import { SDPMessage } from "../models/models";

export type JoinRoomInput = {
  room_id: string; // ルームID
  user_id: string; // ユーザーID
};

export interface SignalingUseCase {
  // ルームに参加する
  joinRoom: (input: JoinRoomInput) => Promise<void>;

  // ルームから退出する
  leaveRoom: () => Promise<void>;

  // オファー、アンサー、ICE候補の処理
  handleSDP: (msg: Message<'sdp'>, selfUserId: string) => Promise<void>;
  handleICECandidate: (msg: Message<'ice'>) => Promise<void>;
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
          sdp: offer,
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

    handleSDP: async (msg: Message<'sdp'>, selfUserId: string): Promise<void> => {
      const sdpPayload: SDPMessage = msg.payload;
      if (sdpPayload.sdp_type === 'offer') {
        // 受信したOfferに応答する
        if( msg.payload.from === selfUserId ) {
          // 自分からのOfferは無視
          return;
        }
        const answer: RTCSessionDescriptionInit = await rtc.respondToOffer(sdpPayload.sdp)
        // Answerの組み立て
        const answerMessage: Message<'sdp'> = {
          message_type: 'sdp',
          payload: {
            sdp_type: 'answer',
            sdp: answer,
            from: selfUserId,
            to: sdpPayload.from,
            room_id: sdpPayload.room_id,
          }
        }
        // Answerの送信
        socket.send(answerMessage);
      } else if (sdpPayload.sdp_type === 'answer') {
        // 受信したAnswerを適用する
        if( msg.payload.to !== selfUserId ) {
          // 自分宛てのAnswerでなければ無視
          return;
        }
        await rtc.applyRemoteAnswer(sdpPayload.sdp);
      }else {
        throw new Error('Unknown SDP type');
      }
    },

    handleICECandidate: async (msg: Message<'ice'>): Promise<void> => {
      const icePayload = msg.payload;
      await rtc.addRemoteIceCandidate({
        candidate: icePayload.candidate,
        sdpMid: icePayload.sdp_mid,
        sdpMLineIndex: icePayload.sdp_mline_index,
      });
    }
  }
}