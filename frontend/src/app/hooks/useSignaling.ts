import { useContext, useEffect } from "react";
import { SignalingContext } from "../providers/SignalingProvider";
import { SignalingUseCase } from "../../domains/signaling/usecase/SignalingUseCase";
import { Message } from "../../domains/message/models/Message";
import { SDPMessage } from "../../domains/signaling/models/models";
import { IceCandidateCallback } from "../../infrastructure/webRTC/RTCClient";
export const useSignaling = ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}): SignalingUseCase => {
  const context = useContext(SignalingContext);
  if (!context) {
    throw new Error("useSignaling must be used within a SignalingProvider");
  }

  // sendICECandidateをuserId, roomIdを含めてラップ
  const usecase: SignalingUseCase = {
    ...context.usecase,
    sendICECandidate: (candidate) => {
      // messageの組み立て
      const message: Message<'ice'> = {
        message_type: 'ice',
        payload: {
          candidate: candidate.candidate || '',
          sdp_mid: candidate.sdpMid || '',
          sdp_mline_index: candidate.sdpMLineIndex || 0,
          from: userId,
          room_id: roomId,
        }
      }
      console.log("Sending ICE candidate", message);
      // 送信
      context.socketService.send(message);
    },
    handleSDP: async (msg, userId) => {
      await context.usecase.handleSDP(msg, userId);
      const localCandidates = context.rtcService.getLocalIceCandidates();
        localCandidates.forEach(candidate => {
        context.usecase.sendICECandidate(candidate);
      });
    },
  }

  // listenerの登録
  useEffect(() => {
    context.socketService.onMessage('sdp', async (msg: SDPMessage) => {
      await usecase.handleSDP(msg, userId);
    });
    context.socketService.onMessage('ice', async (msg) => {
      await usecase.handleICECandidate(msg, userId);
    });
    // RTCServiceにもcallbackを登録
    context.rtcService.addIceCandidateCallback(usecase.sendICECandidate as IceCandidateCallback);

    console.log("Signaling listeners registered");

    return () => {
      context.socketService.offMessage('sdp');
      context.socketService.offMessage('ice');
      context.rtcService.removeIceCandidateCallback();
      console.log("Signaling listeners unregistered");
    }
  }, [context, userId, roomId]);
  
  return usecase;
}