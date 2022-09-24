import { identicon } from "minidenticons";
import { useContext } from "react";
import { userDataContext } from "../../../../App";
import Dialogue from "./Dialogue";
import styles from "./player.module.css";

interface PlayerProps {
  roomId: number;
  isLeader: boolean;
  playerInfo: {
    name: string;
    id: string;
  };
  suggestions: Array<{
    from: string;
    text: string;
    answer: string;
  }>;
  word: string;
  i: number;
}

export default function Player({
  roomId,
  isLeader,
  playerInfo,
  suggestions,
  word,
  i,
}: PlayerProps) {
  const userData = useContext(userDataContext)
  return (
    <div
      className={
        styles.user + " " + styles["player" + (i + 1)] + " " + (isLeader
          ? styles.leader
          : "") + " " + (playerInfo.id === userData.id ? styles.me : "")
      }
      key={playerInfo.id}
    >
      <div className={styles.avatarContainer}>
        <div
          className={styles.avatar}
          dangerouslySetInnerHTML={{
            __html: identicon(playerInfo.name, 75, 30),
          }}
        ></div>
        <p className={styles.username}>{playerInfo.name}</p>
      </div>
      {suggestions
        .filter((a: any) => a.from === playerInfo.id)
        .map((suggestion: any) => (
          <Dialogue
            playerId={playerInfo.id}
            roomId  ={roomId}
            key={"suggestion" + suggestion.from}
            suggestion={suggestion}
            word={word}
            styles={styles}
          />
        ))}
    </div>
  );
}
