import React, { useContext } from "react";
import { IUserData, setGameModalCtx, userDataContext } from "../../../../App";
import UsersList from "../UsersList";
import UserInList from "../UsersList/User";
import styles from "./users-in-room.module.css";

interface UsersInRoomProps {
  users: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export default function UsersInRoom({ users }: UsersInRoomProps) {
  const setGameModal = useContext(setGameModalCtx);
  const userData = useContext(userDataContext);

  const clickHandler = (e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>) => {
    setGameModal({
      showModal: true,
      content: (
        <>
          <h2>Все пользователи в комнате : </h2>
          <UsersList users={users} userData={userData} />
        </>
      ),
    })
  };

  return (
    <p>
      В комнате : {" "}
      <a href="#inroom-users" onClick={(e) => clickHandler(e)}>
        {users && users.length}/8 человек
      </a>
    </p>
  );
}
