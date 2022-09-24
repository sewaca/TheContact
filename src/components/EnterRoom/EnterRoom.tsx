import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { IRoomInfo, setGameModalCtx, setUserDataCtx } from "../../App";
import Loader from "../../UI/Loader";
import styles from "./enter-room.module.css";
import RoomsList from "./RoomsList";
import ReactHintFactory from "react-hint";
import Cookies from "universal-cookie";

interface EnterRoomProps {}

export default function EnterRoom({}: EnterRoomProps) {
  const cookies = new Cookies();
  const ReactHint = ReactHintFactory(React);
  const [validator, setValidator] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const setUserData = useContext(setUserDataCtx);

  const setGameModal = useContext(setGameModalCtx);

  const CREATE_ROOM__MUTATION = gql`
    mutation CreateRoom($username: String!) {
      createRoom(creator: { name: $username }) {
        roomId
        name
        id
        role
      }
    }
  `;

  const [createRoom] = useMutation(CREATE_ROOM__MUTATION);

  const createRoomHandleClick = () => {
    if (username.length <= 2) return;
    createRoom({ variables: { username: username } }).then(({ data }) => {
      cookies.set("userData", data.createRoom, { maxAge: 60 * 10 });
      setTimeout(function () {
        setUserData(data.createRoom);
      }, 500);
    }).catch(e=>console.log(e));
  };

  return (
    <div>
      <label className={styles.usernameLabel}>
        <span>Введите никнейм : </span>
        <input
          className={
            styles.usernameInput +
            " " +
            (username ? (validator ? styles.valid : styles.invalid) : "")
          }
          onInput={(e: React.SyntheticEvent<HTMLInputElement>) => {
            let value = (e.target as HTMLInputElement).value;
            if (value.length > 2) setValidator(true);
            else setValidator(false);
            setUsername(value);
          }}
        />
      </label>
      <button
        className={styles.createRoomButton}
        onClick={createRoomHandleClick}
      >
        Создать комнату
      </button>
      <RoomsList username={username} />
    </div>
  );
}
