import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import styles from "./room.module.css";
import ReactHintFactory from "react-hint";
import { setUserDataCtx } from "../../../../App";
import Cookies from "universal-cookie";

interface RoomProps {
  room: {
    roomId: number;
    users: Array<{
      name: string;
    }>;
    gamePhase: string;
  };
  username: string;
}

const ReactHint = ReactHintFactory(React);
export default function Room({ room, username }: RoomProps) {
  const [error, setError] = useState<string>("");
  const cookies = new Cookies();

  const JOIN_ROOM__MUTATION = gql`
    mutation JoinRoom($username: String!, $roomId: Int!) {
      joinRoom(name: $username, roomId: $roomId, role: PLAYER) {
        id
        name
        role
        roomId
      }
    }
  `;
  const setUserData = useContext(setUserDataCtx);
  const [joinRoomQuery] = useMutation(JOIN_ROOM__MUTATION);

  function joinRoom(roomId: number) {
    if (!username) {
      setError("Сначала введите имя пользователя");
      return;
    } else setError("");
    joinRoomQuery({
      variables: {
        username: username,
        roomId: roomId,
      },
    }).then(({ data }) => {
      cookies.set("userData", data.joinRoom, { maxAge: 60 * 10 });
      setUserData(data.joinRoom);
    });
  }

  return (
    <div key={room.roomId} className={styles.room}>
      <div className={styles.col}>
        <h2 className={styles.roomTitle}>Комната номер {room.roomId}</h2>
        <p className={styles.aboutRoom + " " + (room.users.length > 8 ? styles.overfilled : "")}>
          В комнате{" "}
          <span className={styles.underlined}>
            {room.users.length}/8 человек
          </span>
        </p>
        <p className={styles.aboutRoom}>
          В данный момент :{" "}
          <span className={styles.underlined}>
            {room.gamePhase === "INGAME" ? "идет игра" : "ожидание игроков"}
          </span>
        </p>
        <p className={styles.error}>{error}</p>
      </div>
      <ReactHint autoPosition events delay={{ show: 100, hide: 300 }} />
      <button
        className={
          styles.joinRoom +
          (room.gamePhase === "INGAME" ? " " + styles.disabled : "")
        }
        disabled={room.gamePhase === "INGAME"}
        onClick={(e) => joinRoom(room.roomId)}
      >
        Вступить
      </button>
    </div>
  );
}
