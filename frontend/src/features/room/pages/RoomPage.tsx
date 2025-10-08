import { useParams } from 'react-router-dom';
import { useAuth, useTextMessage } from '../../../app/hooks';
import { TextMessageProvider } from '../../../app/providers';
import { SocketProvider } from '../../../app/providers/SocketProvider';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChatForm, ChatFormProps } from '../components/ChatForm';
import { SendTextMessageInput, TextMessageLiveUseCase } from '../../../domains/TextMessage/usecase/TextMessageLiveUseCase';
import { MessageList, MessageListProps } from '../components/MessageList';
import { RTCProvider } from '../../../app/providers/RTCProvider';
import { SignalingProvider } from '../../../app/providers/SignalingProvider';
import { useSignaling } from '../../../app/hooks/useSignaling';
import { LocalMediaProvider } from '../../../app/providers/LocalMediaProvider';
import { useLocalMedia } from '../../../app/hooks/useLocalMedia';
import { LocalMediaUseCase } from '../../../domains/LocalMedia/localMediaUseCase';
import { SignalingUseCase } from '../../../domains/signaling/usecase/SignalingUseCase';
import { User } from '../../../domains/user/models/User';
import { TextMessageHistoryUseCase } from '../../../domains/TextMessage/usecase/TextMessageHistoryUseCase';
import { IconButton } from '@mui/material';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { getElectronScreenStream } from '../../../infrastructure/webRTC/electronMedia';

type RoomContentProps = {
  roomId: string;
};

export type ChatFormData = {
  content: string;
};

const SendMessageHandler = async (data: ChatFormData, roomId: string, uerId: string, usecase: TextMessageLiveUseCase) => {
  const input: SendTextMessageInput = {
    room_id: roomId,
    user_id: uerId,
    content: data.content,
  }

  await usecase.sendMessage(input);
}

const setup = async (
  localMedia: LocalMediaUseCase,
  SignalingUseCase: SignalingUseCase,
  TextMessageUseCase: TextMessageHistoryUseCase,
  roomId: string,
  user: User | null,
  setHasNext: (hasNext: boolean) => void,
  beforeSentAt: string,
  setBeforeSentAt: (date: string) => void,
  setMediaStream?: (stream: MediaStream[]) => void,
) => {
  const media = await localMedia.initLocalStream();
  if (setMediaStream && media) {
    setMediaStream([media]);
  }

  let remoteAudioEl: HTMLAudioElement | null = null;

  localMedia.onTrack((event) => {
    const remoteStream = event.streams[0];

    // 音声用
    if (remoteStream.getAudioTracks().length > 0) {
      if (!remoteAudioEl) {
        remoteAudioEl = document.createElement("audio");
        remoteAudioEl.autoplay = true;
        document.body.appendChild(remoteAudioEl);
      }
      remoteAudioEl.srcObject = remoteStream;
    }

    // 動画用（画面共有やカメラ映像）
    if (remoteStream.getVideoTracks().length > 0) {
      const videoEl = document.createElement("video");
      videoEl.autoplay = true;
      videoEl.srcObject = remoteStream;
      videoEl.style.width = "50%";
      videoEl.style.border = "1px solid #ccc";
      document.body.appendChild(videoEl);
    }
  });



  await SignalingUseCase.joinRoom({ room_id: roomId, user_id: user?.id || '' });
  console.log("Joined room:", roomId);

  const input = {
    roomId: roomId || '',
    limit: 10,
    beforeSentAt,
  };

  try {
    const res = await TextMessageUseCase.getMessageHistory(input);
    setHasNext(res.data.hasNext);
    setBeforeSentAt(res.data.nextBeforeSentAt);
  } catch {
    setHasNext(false);
  }
}

const RoomContent = ({ roomId }: RoomContentProps) => {
  const { register, handleSubmit, reset } = useForm<ChatFormData>();
  const { user } = useAuth();
  const { comments, usecase } = useTextMessage();
  const [isMuted, setIsMuted] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream[]>([]);
  const [beforeSentAt, setBeforeSentAt] = useState(new Date().toISOString());
  const SignalingUseCase = useSignaling({ userId: user?.id || '', roomId });
  const localMedia = useLocalMedia();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {

    setup(
      localMedia,
      SignalingUseCase,
      usecase.history,
      roomId,
      user,
      setHasNext,
      beforeSentAt,
      setBeforeSentAt,
      setMediaStream,
    );

    return () => {
      SignalingUseCase.leaveRoom();
    }
  }, [])

  const toggleMute = () => {
    if (!mediaStream) return;

    mediaStream[0].getAudioTracks().forEach(track => {
      track.enabled = isMuted; // ミュートなら再度有効化
    });

    setIsMuted(prev => !prev);
  };

  const startScreenShare = async () => {
    if (!user) return;

    try {
      const screenStream = await localMedia.initLocalStream(getElectronScreenStream);

      if (!screenStream) {
        console.warn("No screen stream obtained.");
        return;
      }

      // 既存配列に追加
      setMediaStream(prev => [...prev, screenStream]);

      // 動画表示用
      const videoEl = document.createElement("video");
      videoEl.autoplay = true;
      videoEl.muted = true; // 自分の画面はミュート
      videoEl.srcObject = screenStream;
      videoEl.style.width = "50%";
      videoEl.style.border = "1px solid #ccc";
      document.body.appendChild(videoEl);

      setIsScreenSharing(true);

      // screenStreamの終了イベントで停止処理
      const videoTracks = screenStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].onended = () => {
          setMediaStream(prev => prev.filter(s => s !== screenStream));
          videoEl.remove();
          setIsScreenSharing(false);
        };
      } else {
        console.warn("No video tracks found in screen stream.");
      }
    } catch (err) {
      console.error("Failed to start screen share:", err);
    }
  };

  const onSubmit = handleSubmit((data) => {
    if (!user) return;
    SendMessageHandler(data, roomId, user.id, usecase.live);
  });

  const chatProps: ChatFormProps = {
    register,
    onSubmit,
    reset,
  };

  const messageListProps: MessageListProps = {
    messages: comments,
    roomId: roomId,
    beforeSentAt: beforeSentAt,
    hasNext: hasNext,
    fetchMore: usecase.history.getMessageHistory,
  }

  return (
    <div>
      <IconButton onClick={toggleMute} style={{ display: 'block', margin: 'auto', outline: 'none' }}>
        {isMuted ? <FiMicOff /> : <FiMic />}
      </IconButton>
      <IconButton onClick={startScreenShare} disabled={isScreenSharing}>
        {isScreenSharing ? "Sharing..." : "Share Screen"}
      </IconButton>
      <ChatForm {...chatProps} />
      <MessageList {...messageListProps} />
    </div>
  )
}

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) {
    return <div>Room ID is not provided</div>;
  }

  return (
    <SocketProvider roomId={roomId}>
      <RTCProvider>
        <SignalingProvider>
          <TextMessageProvider>
            <LocalMediaProvider>
              <RoomContent roomId={roomId} />
            </LocalMediaProvider>
          </TextMessageProvider>
        </SignalingProvider>
      </RTCProvider>
    </SocketProvider>
  )
}
