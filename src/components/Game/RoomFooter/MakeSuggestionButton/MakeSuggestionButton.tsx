import React, { useContext } from "react";
import { IRoomInfo, userDataContext } from "../../../../App";
import useMakeSuggestion from "../../../../Hooks/UseMakeSuggestion";
import useRemoveDetermination from "../../../../Hooks/UseRemoveDetermination";
import styles from "./make-suggestion-button.module.css";

interface MakeSuggestionButtonProps {
  roomInfo: IRoomInfo;
}

export default function MakeSuggestionButton({
  roomInfo,
}: MakeSuggestionButtonProps) {
  const userData = useContext(userDataContext);
  const [removeDetermination] = useRemoveDetermination();
  const [newDetermination] = useMakeSuggestion();
  var haveMySuggestion = roomInfo.suggestions?.filter(
    (s) => s.from === userData.id
  ).length;

  return haveMySuggestion ? (
    <button className={styles.determ} onClick={(e) => removeDetermination()}>
      Отозвать определение
    </button>
  ) : (
    <button className={styles.determ} onClick={(e) => newDetermination()}>
      Предложить определение
    </button>
  );
}
