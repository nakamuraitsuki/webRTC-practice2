import { Room } from "../../models/room";

import styles from "./index.module.css";
import { RoomListItem } from "./RoomListItem";

type RoomListProps = {
  rooms: Room[];
};

export const RoomList = ({ rooms }: RoomListProps) => {
  return (
    <div className={styles.roomList}>
      <h2>ルーム一覧</h2>
        {rooms.map((room) => (
          <RoomListItem key={room.id} room={room} />
        ))}
    </div>
  );
}