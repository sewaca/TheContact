import React from 'react'
import UseMakeGuess from '../../../../Hooks/UseMakeGuess';
import styles from './make-guess-button.module.css'

export default function MakeGuessButton() {
  const [showGuessWordModal] = UseMakeGuess();

  return <button className={styles.guess} onClick={showGuessWordModal}>Угадать слово</button>
}