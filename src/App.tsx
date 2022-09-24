import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React, { createContext, useState } from "react";
import "./App.css";
import Game from "./components/Game";
import Cookies from "universal-cookie";
import EnterRoom from "./components/EnterRoom";
import Modal from "./UI/Modal";

const client = new ApolloClient({
  uri: "http://www.daevolod.ru/graphql",
  // uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

export interface IUserData {
  roomId: number | false;
  name: string;
  id: string;
  role: "PLAYER" | "LEADER" | "SPECTATOR";
}

export interface IRoomInfo {
  gamePhase?: string;
  word?: string;
  openedLetters?: number;
  roomId?: number;
  users?: Array<{
    name: string;
    id: string;
    role: string;
  }>;
  suggestions?: Array<{
    id: string;
    from: string;
    text: string;
    answer: string;
  }>;
}

export const userDataContext = createContext<IUserData>({
  roomId: -1,
  name: "",
  id: "",
  role: "SPECTATOR",
});

export const setGameModalCtx = createContext<
  React.Dispatch<React.SetStateAction<IGameModal>>
>(function () {});

export const setUserDataCtx = createContext<
  React.Dispatch<React.SetStateAction<IUserData>>
>(function () {});

export interface IGameModal {
  showModal: Boolean;
  content?: string | React.ReactNode;
  modalSettings?: {
    transparentContent?: Boolean;
    unavailableToClose?: Boolean;
    closeModal?: Function;
  };
}

function App() {
  const cookies = new Cookies();

  const [userData, setUserData] = useState<IUserData>(
    cookies.get("userData") || {
      roomId: false,
      name: "",
      id: "",
      role: "SPECTATOR",
    }
  );
  cookies.set("userData", userData, { maxAge: 60 * 10 });

  const [gameModal, setGameModal] = useState<IGameModal>({
    showModal: false,
    content: "",
  });

  return (
    <ApolloProvider client={client}>
      <setGameModalCtx.Provider value={setGameModal}>
        <main>
          {gameModal.showModal ? (
            <Modal
              {...gameModal.modalSettings}
              closeModal={
                gameModal.modalSettings && gameModal.modalSettings.closeModal
                  ? gameModal.modalSettings.closeModal
                  : () => setGameModal({ showModal: false })
              }
            >
              {gameModal.content}
            </Modal>
          ) : null}

          <setUserDataCtx.Provider value={setUserData}>
            {userData.roomId ? (
              <userDataContext.Provider value={userData}>
                <Game roomId={userData.roomId} gameModal={gameModal} />
              </userDataContext.Provider>
            ) : (
              <EnterRoom />
            )}
          </setUserDataCtx.Provider>
        </main>
      </setGameModalCtx.Provider>
    </ApolloProvider>
  );
}

export default App;
