import { gql, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import {
  IUserData,
  setGameModalCtx,
  userDataContext,
} from "../../../../../App";
import styles from "./user-in-list.module.css";

interface UserInListProps {
  userData: IUserData;
  user: {
    name: string;
    id: string;
    role: string;
  };
}

export default function User({ user, userData }: UserInListProps) {
  const GIVE_ROLE__MUTATION = gql`
    mutation GiveRole(
      $roomId: Int!
      $playerid: String!
      $newRole: UserRoleEnum!
    ) {
      giveRole(roomId: $roomId, playerid: $playerid, newRole: $newRole)
    }
  `;
  const [giveRole] = useMutation(GIVE_ROLE__MUTATION);

  const setGameModal = useContext(setGameModalCtx);
  const closeModal = () => {
    setGameModal({ showModal: false });
  };

  const handleClick = (role: string) => {
    giveRole({
      variables: {
        roomId: userData.roomId,
        playerid: user.id,
        newRole: role,
      },
    });
    closeModal();
  };

  const rolesTranslator: {
    [key: string]: string;
  } = {
    PLAYER: "Игрок",
    LEADER: "Ведущий",
    SPECTATOR: "Наблюдающий",
  };

  return (
    <div className={styles.user}>
      <div>
        <p className={styles.username} key={user.id}>
          {user.name}
          {user.id === userData.id ? (
            <span className={styles.me}> - Я </span>
          ) : (
            ""
          )}
        </p>
        <span className={styles.role}> {rolesTranslator[user.role]} </span>
      </div>
      {userData.role === "LEADER" && user.id !== userData.id ? (
        <div className={styles.buttons}>
          <button
            className={styles.button}
            onClick={(e) => handleClick("LEADER")}
          >
            Сделать ведущим
          </button>
          <button
            className={styles.button}
            onClick={(e) => handleClick("PLAYER")}
          >
            Сделать игроком
          </button>
          <button
            className={styles.button + " " + styles.lastButton}
            onClick={(e) => handleClick("SPECTATOR")}
          >
            Сделать наблюдающим
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
