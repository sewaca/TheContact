import React from "react";
import Player from "./Player";
import styles from "./room-table.module.css";

interface RoomTableProps {
  roomInfo: any;
}

export default function RoomTable({ roomInfo }: RoomTableProps) {
  var word = roomInfo.word.slice(0, roomInfo.openedLetters);
  return (
    <div className={styles.table}>
      <div className={styles.tablebg}></div>

      <div className={styles.content}>
        {roomInfo.gamePhase === "INGAME" ? (
          <>
            <h2>Загадано слово : </h2>
            <p className={styles.word}>{word}</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.8em" }}>Игра окончена</h1>
            {word ? (
              <h2 className={styles.guessedWord}>
                Загаданое слово : <span>{word}</span>
              </h2>
            ) : (
              ""
            )}
          </>
        )}
      </div>
      {roomInfo.users.map((user: any, i: number) =>
        user.role === "PLAYER" || user.role === "LEADER" ? (
          <Player
            roomId={roomInfo.roomId}
            isLeader={user.role === "LEADER"}
            key={user.id}
            i={i}
            playerInfo={user}
            suggestions={roomInfo.suggestions}
            word={word}
          />
        ) : (
          ""
        )
      )}
    </div>
  );
}
