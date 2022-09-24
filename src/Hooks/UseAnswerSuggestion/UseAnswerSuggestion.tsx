import { gql, useMutation } from "@apollo/client";
import { useContext } from "react";
import { userDataContext } from "../../App";

interface IUseAnswerSuggestionProps {
  setAnsweredSuggestion: Function;
  isLeader: Boolean;
}

const ANSWER_SUGGESTION_MUTATION__player = gql`
  mutation answerSuggestion(
    $userId: String!
    $roomId: Int!
    $suggestionId: String!
    $answer: String!
  ) {
    answerSuggestion(
      playerid: $userId
      roomId: $roomId
      suggestionId: $suggestionId
      answer: $answer
    )
  }
`;

const ANSWER_SUGGESTION_MUTATION__leader = gql`
  mutation answerSuggestionLeader(
    $roomId: Int!
    $suggestionId: String!
    $answer: String!
  ) {
    answerSuggestionLeader(
      roomId: $roomId
      suggestionId: $suggestionId
      answer: $answer
    )
  }
`;

export default function useAnswerSuggestion({
  setAnsweredSuggestion,
  isLeader,
}: IUseAnswerSuggestionProps) {
  const [mutateFunction] = useMutation(
    isLeader
      ? ANSWER_SUGGESTION_MUTATION__leader
      : ANSWER_SUGGESTION_MUTATION__player
  );
  const userData = useContext(userDataContext);
  if (isLeader) {
    return function answerSuggestion(suggestionId: string, answer: string) {
      mutateFunction({
        variables: {
          userId: userData.id,
          roomId: userData.roomId,
          suggestionId: suggestionId,
          answer: answer,
        },
      }).then((d) => {
        if (d.data) {
          if (d.data.answerSuggestionLeader) {
            setAnsweredSuggestion({
              showModal: true,
              content: <h1 style={{ color: "#fff" }}>Нет, это не {answer}!</h1>,
              modalSettings: {
                unavailableToClose: true,
                transparentContent: true,
              },
            });
            setTimeout(
              () =>
                setAnsweredSuggestion({
                  showModal: false,
                  content: "",
                }),
              1500
            );
          }
        }
      });
    };
  }

  return function answerSuggestion(suggestionId: string, answer: string) {
    var data = { answerSuggestion: "" },
      loading = true,
      error = false;
    mutateFunction({
      variables: {
        userId: userData.id,
        roomId: userData.roomId,
        suggestionId: suggestionId,
        answer: answer,
      },
    }).then((a) => {
      loading = false;
      if (a.data) data = a.data;
      else if (a.errors) error = true;
    });

    var countDown = 4;
    setAnsweredSuggestion({
      showModal: true,
      content: <h1 style={{ color: "#fff" }}>Есть контакт!</h1>,
      modalSettings: { unavailableToClose: true, transparentContent: true },
    });
    var interval = setInterval(() => {
      countDown--;
      if (countDown > 0)
        setAnsweredSuggestion({
          showModal: true,
          content: <h1 style={{ color: "#fff" }}>{countDown}</h1>,
          modalSettings: { unavailableToClose: true, transparentContent: true },
        });
      else if (countDown === 0) {
        if (loading || error) setAnsweredSuggestion({ showModal: false });
        else
          setAnsweredSuggestion({
            showModal: true,
            content: (
              <h1 style={{ color: "#fff" }}>
                {data.answerSuggestion
                  ? "Новая буква открыта!"
                  : "Ответы не совпали"}
              </h1>
            ),
            modalSettings: {
              unavailableToClose: true,
              transparentContent: true,
            },
          });
      } else {
        setAnsweredSuggestion({ showModal: false });
        clearInterval(interval);
      }
    }, 1000);
  };
}
