import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import './MensagemDoDiaExibicao.css'; // Certifique-se de que o CSS está importado

const MensagemDoDiaExibicao = () => {
  const [mensagemDoDia, setMensagemDoDia] = useState(null);

  useEffect(() => {
    const buscarMensagem = async () => {
      try {
        const colecaoRef = collection(db, "Mensagem-do-dia");
        const mensagemSnapshot = await getDocs(colecaoRef);

        if (!mensagemSnapshot.empty) {
          const mensagemData = mensagemSnapshot.docs[0].data();
          setMensagemDoDia(mensagemData);
        } else {
          setMensagemDoDia(null);
        }
      } catch (error) {
        console.error("Erro ao buscar a mensagem do dia:", error);
      }
    };

    buscarMensagem();
  }, []);

  return (
    <div className="mensagem-do-dia">
      {mensagemDoDia ? (
        <>
        <h2>Mensagem do dia!</h2>
          <h3>{mensagemDoDia.titulo}</h3>
          <p>{mensagemDoDia.mensagem}</p>
        </>
      ) : (
        <p>Não há mensagem do dia disponível.</p>
      )}
    </div>
  );
};

export default MensagemDoDiaExibicao;
