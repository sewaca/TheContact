import { gql, useMutation } from '@apollo/client';
import React, { useContext } from 'react'
import { userDataContext, setGameModalCtx } from '../../App';
import styles from './useMakeGuess.module.css';

export default function UseMakeGuess() {
  const setGameModal = useContext(setGameModalCtx);
  const userData = useContext(userDataContext);

  const MAKE_GUESS__MUTATION = gql`
    mutation MakeGuess($roomId: Int!, $answer: String!) {
      makeGuess(roomId: $roomId, answer: $answer)
    }
  `;
  const [makeGuess] = useMutation(MAKE_GUESS__MUTATION);

  const sendAnswer = (answer: string) => {
    makeGuess({ variables: { roomId: userData.roomId, answer: answer } })
      .then((d) => {
        setGameModal({
          showModal: true,
          content: (
            <h2 style={{ color: "#fff" }}>
              {d.data?.makeGuess ? "Успешно!" : "Не повезло :("}
            </h2>
          ),
          modalSettings: {
            transparentContent: true,
          },
        });
        setTimeout(() => setGameModal({ showModal: false }), 800);
      })
      .catch((e) => console.log(e));
  };

  return [() => {
    setGameModal({
      showModal: true,
      content: (
        <>
          <h2 className={styles.modalHeader}>Угадать слово</h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              let z = new FormData(e.target as HTMLFormElement);
              sendAnswer("" + z.get("answer"));
            }}
          >
            <label className={styles.label}>
              <span>Ответ : </span>
              <input type="text" name="answer" />
            </label>
            <button type="submit"> Ответить </button>
          </form>
        </>
      ),
    });
  }];
}