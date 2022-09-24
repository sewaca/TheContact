import useLeaveRoom from "../../../../Hooks/UseLeaveRoom";
import styles from "./leave-button.module.css";

export default function LeaveButton() {
  const [showLeaveRoomModal] = useLeaveRoom();
  return (
    <button className={styles.leave} onClick={showLeaveRoomModal}>
      Покинуть комнату
    </button>
  );
}
