import { useParams } from 'react-router-dom';
import { useTextMessage } from '../../../app/hooks/useTextMessage';

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

// export const RoomPage = () => {
//   const { user } = useAuth();
//   const { roomId } = useParams<{ roomId: string }>();
//   if (!roomId) return <div>Room ID is required</div>;

//   const { register, handleSubmit, reset } = useForm<FormData>();
//   const { messages, loadMore, sendMessage, hasNext } = useRoomMessages(roomId);
//   console.log('messages', messages);

//   const onSubmit = (data: FormData) => {
//     if (data.message.trim()) {
//       const msg: Message = {
//         message_type: 'text',
//         payload: {
//           id: crypto.randomUUID(), // 一意のIDを生成
//           user_id: user?.id || 'anonymous', // ユーザーIDを設定
//           room_id: roomId, // ルームIDを設定
//           sent_at: new Date().toISOString(), // 現在時刻をISO形式で設定
//           content: data.message, // 入力されたメッセージ
//         } as TextMessage,
//       }
//       sendMessage(msg);
//       reset(); // フォームの値をリセット
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
//         <ChatInput.Field>
//           <ChatInput.Input
//             {...register('message')}
//             placeholder="メッセージを入力"
//           />
//           <ChatInput.Button />
//         </ChatInput.Field>
//       </form>
//       <MessageList
//         messages={messages}
//         fetchMore={loadMore}
//         hasNext={hasNext}
//       />
//     </div>
//   );
// };
