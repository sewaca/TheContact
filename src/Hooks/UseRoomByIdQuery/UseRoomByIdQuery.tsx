import { gql, useQuery } from "@apollo/client";
import React from "react";
import Loader from "../../UI/Loader";

const GET_ROOM_BY_ID_QUERY = gql`
  query RoomInfo($roomId: Int!) {
    roomInfo(roomId: $roomId) {
      roomId
      users {
        name
        id
        role
      }
      gamePhase
      word
      openedLetters
      suggestions {
        id
        from
        text
        answer
      }
    }
  }
`;

export default function UseRoomByIdQuery(roomId: number): any {
  const { loading, error, data, refetch } = useQuery(GET_ROOM_BY_ID_QUERY, {
    variables: { roomId: roomId },
  });
  // Каждые 0.5 секунд обновляем информацию о комнате
  setInterval(refetch, 500);

  if (loading)
    return {
      isAnswer: false,
      replacer: (
        <>
          <Loader />
          <p style={{ marginTop: "10px" }}>Загрузка...</p>
        </>
      )
    };
  else if (error)
    return {
      isAnswer: false,
      replacer: <p>Произошла ошибка. Попробуйте позже...</p>,
    };
  else
    return {isAnswer: true, ...data.roomInfo}
}
