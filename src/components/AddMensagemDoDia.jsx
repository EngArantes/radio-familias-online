import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, deleteDoc, getDocs } from "firebase/firestore";
import './AddMensagemDoDia.css';

const AddMensagemDoDia = () => {
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviarMensagem = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !mensagem.trim()) {
      alert("Por favor, preencha todos os campos antes de enviar.");
      return;
    }

    setEnviando(true);

    try {
      const colecaoRef = collection(db, "Mensagem-do-dia");
      const mensagensExistentes = await getDocs(colecaoRef);

      // Deleta as mensagens existentes antes de adicionar a nova
      for (const doc of mensagensExistentes.docs) {
        await deleteDoc(doc.ref);
      }

      // Adiciona a nova mensagem
      await addDoc(colecaoRef, {
        titulo,
        mensagem,
        data: new Date().toISOString(),
      });

      alert("Mensagem enviada com sucesso!");
      setTitulo("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      alert("Ocorreu um erro ao enviar a mensagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="video-form">
      <form onSubmit={enviarMensagem}>
        <div className="input-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título"
          />
        </div>

        <div className="input-group">
          <label htmlFor="mensagem">Mensagem:</label>
          <textarea
            id="mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite a mensagem"
          />
        </div>

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar Mensagem"}
        </button>
      </form>
    </div>
  );
};

export default AddMensagemDoDia;
