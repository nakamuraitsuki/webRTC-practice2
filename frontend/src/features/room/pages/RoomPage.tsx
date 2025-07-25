import { useParams } from 'react-router-dom';

import { useTextMessage } from '../../../app/hooks';

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) return <div>Room ID is required</div>;

  const { comments } = useTextMessage(roomId);

  console.log('comments', comments);
  return (
    <div>
      RoomPage
    </div>
  )
}
