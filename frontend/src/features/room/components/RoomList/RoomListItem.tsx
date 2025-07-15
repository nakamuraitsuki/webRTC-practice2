import { Link } from "react-router-dom";

import styles from "./RoomListItem.module.css";
import { Room } from "../../../../domains/room/models/Room";

type RoomListItemProps = {
  room: Room;
};

export const RoomListItem = ({ room }: RoomListItemProps) => {
  return (
    <Link to={`/room/${room.id}`} className={styles.roomListItem}>
      <div className={styles.name}>{room.name}</div>
    </Link>
  )
}
