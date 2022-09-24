import { useMutation, gql } from "@apollo/client";
import { useContext } from "react";
import { setGameModalCtx, setUserDataCtx, userDataContext } from "../../App";
import styles from "./use-leave-room.module.css";

export default function useLeaveRoom() {
  const setGameModal = useContext(setGameModalCtx);
  const userData = useContext(userDataContext);
  const setUserData = useContext(setUserDataCtx);

  const LEAVE_ROOM__MUTATION = gql`
    mutation leaveRoom($userId: String!, $roomId: Int!) {
      leaveRoom(userId: $userId, roomId: $roomId) {
        roomId
      }
    }
  `;
  const [leaveRoom] = useMutation(LEAVE_ROOM__MUTATION);

  return [
    () => {
      setGameModal({
        showModal: true,
        content: (
          <>
            <h2 className={styles.modalHeader}>
              Вы уверены что хотите покинуть комнату?
            </h2>
            <button
              className={styles.leave}
              onClick={(e) => {
                leaveRoom({
                  variables: { userId: userData.id, roomId: userData.roomId },
                });
                setGameModal({ showModal: false });
                setUserData({
                  roomId: false,
                  name: "",
                  id: "",
                  role: "SPECTATOR",
                });
              }}
            >
              Да. Покинуть
            </button>
          </>
        ),
      });
    },
  ];
}
