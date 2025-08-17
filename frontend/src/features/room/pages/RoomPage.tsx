import { useParams } from 'react-router-dom';

import { useTextMessage } from '../../../app/hooks';
import { TextMessageProvider } from '../../../app/providers';
import { SocketProvider } from '../../../app/providers/SocketProvider';

type RoomContentProps = { roomId: string };

const RoomContent = ({ roomId }: RoomContentProps) => {
  const { comments } = useTextMessage(roomId);

  console.log('comments', comments);

  return (
    <div>
      Room Content
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
      <TextMessageProvider>
        <RoomContent roomId={roomId} />
      </TextMessageProvider>
    </SocketProvider>
  )
}
