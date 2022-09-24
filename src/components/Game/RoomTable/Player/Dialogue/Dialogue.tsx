import { useContext, useState } from "react";
import { userDataContext } from "../../../../../App";
import { sendAnswerSuggestionFuncCtx } from "../../../Game";

interface DialogueProps {
  playerId: string;
  roomId: number;
  suggestion: {
    text: string;
    from: string;
    id: string;
  };
  word: string;
  styles: any;
}

export default function Dialogue({
  suggestion,
  word,
  styles,
  roomId,
  playerId,
}: DialogueProps) {
  const [answer, setAnswer] = useState("");
  const [isOpened, setIsOpened] = useState(true);
  var sendAnswer = useContext(sendAnswerSuggestionFuncCtx);
  var userData = useContext(userDataContext);
  var isLeader = userData.role === "LEADER";

  return (
    <div
      className={styles.dialogue + " " + (!isOpened ? styles.closed : "")}
      key={"suggestion" + suggestion.from}
    >
      <button onClick={(e) => setIsOpened(!isOpened)} className={styles.close}>
        <div className={styles.e1}></div>
        <div className={styles.e2}></div>
      </button>
      <p className={styles.question}>{suggestion.text}</p>
      {playerId !== userData.id ? (
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
           
            let z: any = new FormData(e.target);
            if(!z.get("answer")) return false;
            sendAnswer(suggestion.id, z.get("answer"));
          }}
        >
          <input
            placeholder="Предположение"
            value={answer}
            name="answer"
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button type="submit" className={styles.suggest}>
            {isLeader ? "Предположить" : "Есть контакт!"}
          </button>
        </form>
      ) : (
        ""
      )}
    </div>
  );
}
