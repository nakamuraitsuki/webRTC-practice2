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
import { DataChannelProvider } from '../../../app/providers/DataChannelProvider';
import { useDataChannel } from '../../../app/hooks/useDataChannel';
import { DataChannelUseCase } from '../../../domains/dataChannel/dataChannelUseCase';
import { SignalingUseCase } from '../../../domains/signaling/usecase/SignalingUseCase';
import { User } from '../../../domains/user/models/User';
import { TextMessageHistoryUseCase } from '../../../domains/TextMessage/usecase/TextMessageHistoryUseCase';
import { IconButton } from '@mui/material';
import { FiMic, FiMicOff } from 'react-icons/fi';

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
  DataChannel: DataChannelUseCase,
  SignalingUseCase: SignalingUseCase,
  TextMessageUseCase: TextMessageHistoryUseCase,
  roomId: string,
  user: User | null,
  setHasNext: (hasNext: boolean) => void,
  beforeSentAt: string,
  setBeforeSentAt: (date: string) => void,
  setMediaStream?: (stream: MediaStream) => void,
) => {
  const media = await DataChannel.initLocalStream();
  if (setMediaStream && media) {
    setMediaStream(media);
  }

  let remoteAudioEl: HTMLAudioElement | null = null;

  DataChannel.onTrack((event) => {
    const remoteStream = event.streams[0];
    if (!remoteAudioEl) {
      remoteAudioEl = document.createElement("audio");
      remoteAudioEl.autoplay = true;
      document.body.appendChild(remoteAudioEl);
    }
    remoteAudioEl.srcObject = remoteStream;
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
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [beforeSentAt, setBeforeSentAt] = useState(new Date().toISOString());
  const SignalingUseCase = useSignaling({ userId: user?.id || '', roomId });
  const DataChannel = useDataChannel();

  useEffect(() => {

    setup(
      DataChannel,
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

      mediaStream.getAudioTracks().forEach(track => {
      track.enabled = isMuted; // ミュートなら再度有効化
    });

    setIsMuted(prev => !prev);
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
      <ChatForm {...chatProps} />
      <MessageList {...messageListProps}/>
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
            <DataChannelProvider>
              <RoomContent roomId={roomId} />
            </DataChannelProvider>
          </TextMessageProvider>
        </SignalingProvider>
      </RTCProvider>
    </SocketProvider>
  )
}
