import React, { useContext } from "react";
import { IRoomInfo, setGameModalCtx, userDataContext } from "../../../App";
import styles from "./room-header.module.css";
import UsersInGame from "./UsersInGame";
import UsersInRoom from "./UsersInRoom";

interface IRoomHeaderProps {
  roomInfo: IRoomInfo;
}

export default function RoomHeader({ roomInfo }: IRoomHeaderProps) {
  const setGameModal = useContext(setGameModalCtx);
  const userData = useContext(userDataContext);
  return (
    <header className={styles.header}>
      <h1 className={styles.roomTitle}>Комната № {roomInfo.roomId}</h1>
      <UsersInRoom users={roomInfo.users || []} />
      <UsersInGame
        users={
          roomInfo.users?.filter(
            (a) => a.role === "PLAYER" || a.role === "LEADER"
          ) || []
        }
      />
    </header>
  );
}
