import { gql, useMutation } from '@apollo/client';
import React, { useContext } from 'react'
import { userDataContext, setGameModalCtx } from '../../App';


export default function useRemoveDetermination() {
  const REMOVE_MY_SUGGESTION__MUTATION = gql`
    mutation RemoveMySuggestion($roomId: Int!, $playerid: String!) {
      removeSuggestion(roomId: $roomId, playerid: $playerid)
    }
  `;
  const [removeSuggestion] = useMutation(REMOVE_MY_SUGGESTION__MUTATION);
  const userData = useContext(userDataContext);
  const setGameModal = useContext(setGameModalCtx);

  return [() => {
    console.log({
      variables: { roomId: userData.roomId, playerid: userData.id },
    });

    removeSuggestion({
      variables: { roomId: userData.roomId, playerid: userData.id },
    })
      .then((d) => {
        setGameModal({ showModal: false });
      })
      .catch((e) => {
        setGameModal({ showModal: true, content: <h2>Ошибка!</h2> });
        setTimeout(() => setGameModal({ showModal: false }), 800);
      });
  }]
}