// src/contexts/PlayerContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, doc, getDoc, setDoc, getPlayerState, updatePlayerState } from '../firebaseConfig'; // Corrigindo a importação

const PlayerContext = createContext();

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const PlayerProvider = ({ children }) => {
  const [isPlayerActive, setIsPlayerActive] = useState(true); // Estado local do player

  // Função para alternar o estado do player
  const togglePlayer = async () => {
    const newState = !isPlayerActive;
    setIsPlayerActive(newState);

    // Salvar o novo estado no Firestore
    await updatePlayerState(newState); // Usando a função para atualizar o estado do player
  };

  // Recuperar o estado do player no Firestore ao carregar o app
  useEffect(() => {
    const loadPlayerState = async () => {
      const state = await getPlayerState(); // Usando a função para pegar o estado
      setIsPlayerActive(state); // Atualizar o estado com o valor do Firestore
    };

    loadPlayerState();
  }, []);

  return (
    <PlayerContext.Provider value={{ isPlayerActive, togglePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};
