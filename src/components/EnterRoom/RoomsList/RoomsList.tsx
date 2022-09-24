import { gql, useQuery } from "@apollo/client";
import React from "react";
import { IRoomInfo } from "../../../App";
import Loader from "../../../UI/Loader";
import Room from "./Room/Room";
import styles from "./rooms-list.module.css";

interface RoomsListProps {
  username: string;
}

export default function RoomsList({ username }: RoomsListProps) {
  const GET_ALL_ROOMS__QUERY = gql`
    query GetAllRooms {
      getAllRooms {
        users {
          name
        }
        gamePhase
        roomId
      }
    }
  `;

  const { loading, data, error, refetch } = useQuery(GET_ALL_ROOMS__QUERY);
  setInterval(refetch, 300);

  if (loading) return <Loader />;
  if (error) return <p>Произошла ошибка. Попробуйте позже</p>;

  var rooms = [...data.getAllRooms].sort((a: IRoomInfo, b: IRoomInfo) =>
    Number(
      (a.gamePhase === "INGAME" && 10000000000) ||
        (b.gamePhase === "INGAME" && -10000000000) ||
        ((a.users || []).length >= 8 && 10000000000) ||
        ((b.users || []).length >= 8 && -10000000000) ||
        (b.users || []).length - (a.users || []).length
    )
  );

  return (
    <div>
      <h2 className={styles.roomListHeader}>Все доступные комнаты : </h2>
      {rooms.map((room) => (
        <Room key={room.roomId} room={room} username={username} />
      ))}
    </div>
  );
}
