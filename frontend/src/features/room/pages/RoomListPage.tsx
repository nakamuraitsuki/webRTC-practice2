import { Link } from "react-router-dom";
import { RoomList } from "../components";

import styles from "./RoomListPage.module.css";
import { useRoom } from "../../../app/hooks/useRoom";

export const RoomListPage = () => {
  const { rooms } = useRoom();

  if (!rooms) return <div>Loading...</div>;
  
  return (
    <div className={styles.container}>
      <h1>Room List</h1>
      <Link to="/room/create" className={styles.createRoomLink}>
        Create Room
      </Link >
      <RoomList rooms={rooms} />
    </div>
  );
}