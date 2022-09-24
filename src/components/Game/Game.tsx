import { createContext, useContext } from "react";
import RoomFooter from "./RoomFooter";
import RoomHeader from "./RoomHeader";
import RoomTable from "./RoomTable";
import {
  IGameModal,
  IUserData,
  setGameModalCtx,
  setUserDataCtx,
  userDataContext,
} from "../../App";
import UseRoomByIdQuery from "../../Hooks/UseRoomByIdQuery";
import useAnswerSuggestion from "../../Hooks/UseAnswerSuggestion";
import Cookies from "universal-cookie";

interface GameProps {
  roomId: number;
  gameModal: IGameModal;
}

export const sendAnswerSuggestionFuncCtx = createContext(function (
  suggestion: string,
  answer: string
) {});

export default function Game({ roomId, gameModal }: GameProps) {
  const userData = useContext(userDataContext);
  const roomInfo = UseRoomByIdQuery(roomId);
  const cookies = new Cookies();

  const setGameModal = useContext(setGameModalCtx);
  const setUserData = useContext(setUserDataCtx);

  //* Логика для ответа на определение для player и leader *//
  var answerSuggestion = useAnswerSuggestion({
    setAnsweredSuggestion: setGameModal,
    isLeader: userData.role === "LEADER",
  });

  if (!roomInfo.roomId && roomInfo.isAnswer) {
    let loggedOutUserData: IUserData = {
      roomId: false,
      name: "",
      id: "",
      role: "SPECTATOR",
    };
    setUserData(loggedOutUserData);
    cookies.set("userData", loggedOutUserData, { maxAge: 60 * 10 });
    return <></>
  }

  if (roomInfo.isAnswer) {
    let user = roomInfo.users.filter((a: any) => a.id === userData.id)[0];
    if (user.role !== userData.role || user.name !== userData.name) {
      setUserData({ ...user, roomId: userData.roomId });
      cookies.set(
        "userData",
        { ...user, roomId: userData.roomId },
        { maxAge: 60 * 10 }
      );
    }
  }

  return (
    <>
      {roomInfo.isAnswer ? (
        <setGameModalCtx.Provider value={setGameModal}>
          <sendAnswerSuggestionFuncCtx.Provider value={answerSuggestion}>
            <RoomHeader roomInfo={roomInfo} />
            <RoomTable roomInfo={roomInfo} />
            <RoomFooter roomInfo={roomInfo} />
          </sendAnswerSuggestionFuncCtx.Provider>
        </setGameModalCtx.Provider>
      ) : (
        roomInfo.replacer
      )}
    </>
  );
}
