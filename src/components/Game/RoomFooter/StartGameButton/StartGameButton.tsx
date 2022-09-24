import { gql, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { setGameModalCtx } from "../../../../App";
import styles from "./start-game-button.module.css";

interface StartGameButtonProps {
  numOfUsers: number;
  roomId: number;
}

export default function StartGameButton({
  numOfUsers,
  roomId,
}: StartGameButtonProps) {
  const SET_ROOM_WORD__MUTATION = gql`
    mutation SetGameWord($roomId: Int!, $word: String!) {
      setGameWord(roomId: $roomId, word: $word)
    }
  `;
  const [setGameWord] = useMutation(SET_ROOM_WORD__MUTATION);
  const setGameModal = useContext(setGameModalCtx);

  const submitHandler = (e: React.SyntheticEvent<HTMLFormElement>) => {
    var form = e.target as HTMLFormElement;
    var z = new FormData(form);
    setGameWord({
      variables: {
        roomId: roomId,
        word: z.get("word"),
      },
    }).then(({ data }) => {
      setGameModal({
        showModal: true,
        content: (
          <p>
            {data.setGameWord
              ? "Игра началась"
              : "Что-то пошло не так. Перезагрузите страницу"}
          </p>
        ),
      });
      setTimeout(()=>{
        setGameModal({showModal: false});
      }, 800);
    });
  };

  const handleClick = () => {
    setGameModal({
      showModal: true,
      content:
        numOfUsers > 2 ? (
          <form className={styles.form} onSubmit={(e) => submitHandler(e)}>
            <h2 className={styles.modalHeader}>Начать игру с новым словом :</h2>
            <label>
              <span>Загаданное слово : </span>
              <input type="text" name="word" />
            </label>
            <button type="submit">Начать игру</button>
          </form>
        ) : (
          <p>Недостаточно игроков </p>
        ),
    });
  };

  return (
    <button onClick={handleClick} className={styles.startNewGame}>
      Начать новую игру
    </button>
  );
}
