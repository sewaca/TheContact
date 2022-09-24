import { useContext } from "react";
import { IRoomInfo, userDataContext } from "../../../App";
import LeaveButton from "./LeaveButton";
import MakeGuessButton from "./MakeGuessButton";
import MakeSuggestionButton from "./MakeSuggestionButton";
import styles from "./room-footer.module.css";
import StartGameButton from "./StartGameButton";

interface RoomFooterProps {
  roomInfo: IRoomInfo;
}

export default function RoomFooter({ roomInfo }: RoomFooterProps) {
  const userData = useContext(userDataContext);

  return (
    <footer className={styles.roomFooter}>
      {userData.role === "LEADER" ? (
        <StartGameButton roomId={Number(userData.roomId)} numOfUsers={roomInfo.users?.length || 0}/>
      ) : userData.role === "PLAYER" ? (
        <>
          <MakeSuggestionButton roomInfo={roomInfo} />
          <MakeGuessButton />
        </>
      ) : ""}

      <LeaveButton />
    </footer>
  );
}
