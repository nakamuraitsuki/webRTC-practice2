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

const RoomContent = ({ roomId }: RoomContentProps) => {
  const { register, handleSubmit, reset } = useForm<ChatFormData>();
  const { user } = useAuth();
  const { comments, usecase } = useTextMessage();
  const [hasNext, setHasNext] = useState(true);
  const [beforeSentAt, setBeforeSentAt] = useState(new Date().toISOString());
  const SignalingUseCase = useSignaling({ userId: user?.id || '', roomId });

  useEffect(() => {
    const input = {
      roomId: roomId || '',
      limit: 10,
      beforeSentAt,
    };

    // ルームに参加
    SignalingUseCase.joinRoom({ room_id: roomId, user_id: user?.id || '' });
    console.log("Joined room:", roomId);

    usecase.history.getMessageHistory(input)
      .then((res) => {
        setHasNext(res.data.hasNext);
        setBeforeSentAt(res.data.nextBeforeSentAt);
      })
      .catch(() => {
        setHasNext(false);
      });
  }, [roomId])

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
            <RoomContent roomId={roomId} />
          </TextMessageProvider>
        </SignalingProvider>
      </RTCProvider>
    </SocketProvider>
  )
}
