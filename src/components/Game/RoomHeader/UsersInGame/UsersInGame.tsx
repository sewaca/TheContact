import React, { useContext, useState } from "react";
import { setGameModalCtx, userDataContext } from "../../../../App";
import UsersList from "../UsersList";
import styles from "./users-in-game.module.css";

interface UsersInGameProps {
  users: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export default function UsersInGame({ users }: UsersInGameProps) {
  const setGameModal = useContext(setGameModalCtx);
  const userData = useContext(userDataContext);

  const clickHandler = () => {
    
    setGameModal({
      showModal: true,
      content: (
        <>
          <h2>В текущей игре :</h2>
          <UsersList users={users} userData={userData}/>
        </>
      ),
    });
  };

  return (
    <p>
      В текущей игре учавствуют :{" "}
      <a href="#ingame-users" onClick={(e) => clickHandler()}>
        {users.length}
        /8 человек
      </a>
    </p>
  );
}
