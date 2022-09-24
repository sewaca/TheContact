import { gql, useMutation } from "@apollo/client";
import React, { useContext } from "react";
import { userDataContext, setGameModalCtx } from "../../App";
import styles from "./useMakeSuggestion.module.css";


export default function useMakeSuggestion() {

  const userData = useContext(userDataContext);
  const setGameModal = useContext(setGameModalCtx);

  const NEW_DETERMINATION__MUTATION = gql`
    mutation makeSuggestion(
      $playerid: String!
      $roomId: Int!
      $text: String!
      $answer: String!
    ) {
      makeSuggestion(
        playerid: $playerid
        roomId: $roomId
        text: $text
        answer: $answer
      ) {
        id
      }
    }
  `;
  const [mutationFunction] = useMutation(NEW_DETERMINATION__MUTATION);

  return [() => {
    const sendDetermination = ({
      text,
      answer,
    }: {
      text: string;
      answer: string;
    }) => {
      mutationFunction({
        variables: {
          playerid: userData.id,
          roomId: userData.roomId,
          text: text,
          answer: answer,
        },
      })
        .then((d) => {
          if (d.data.makeSuggestion.id) {
            setGameModal({
              showModal: true,
              content: <p>Успешно!</p>,
              modalSettings: {
                unavailableToClose: true,
              },
            });
            setTimeout(() => {
              setGameModal({ showModal: false });
            }, 800);
          } else setGameModal({ showModal: false });
        })
        .catch((e) => {
          setGameModal({
            showModal: true,
            content: <p>Ошибка!</p>,
            modalSettings: {
              unavailableToClose: true,
            },
          });
          setTimeout(() => {
            setGameModal({ showModal: false });
          }, 800);
        });
    };
    setGameModal({
      showModal: true,
      content: (
        <>
          <h2 className={styles.modalHeader}>Задать новое определение</h2>
          <form
            className={styles.form}
            onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
              e.preventDefault();
              let z: any = new FormData(e.target as HTMLFormElement);
              let text = z.get("text");
              let answer = z.get("answer");
              sendDetermination({ text: text, answer: answer });
            }}
          >
            <label className={styles.label}>
              <span>Определение : </span>
              <textarea name="text" cols={30} rows={5}></textarea>
            </label>
            <label className={styles.label}>
              <span>Ответ : </span>
              <input type="text" name="answer" />
            </label>
            <button type="submit"> Предложить </button>
          </form>
        </>
      ),
    });
  }];
}
