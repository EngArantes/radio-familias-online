import React, { useState } from 'react';
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import './Contato.css';

const Contato = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Função para enviar a mensagem
  const enviarMensagem = async (e) => {
    e.preventDefault();

    // Verificando se os campos estão preenchidos
    if (!nome || !email || !mensagem) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Adicionando o documento à coleção "Mensagens-recebidas"
      const mensagensRef = collection(db, "Mensagens-recebidas");
      await addDoc(mensagensRef, {
        nome,
        email,
        mensagem,
        data: new Date(),
      });

      // Limpa os campos após o envio
      setNome('');
      setEmail('');
      setMensagem('');
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      alert("Ocorreu um erro ao enviar a mensagem.");
    }
  };

  // Função para controlar o número de caracteres da mensagem
  const handleMensagemChange = (e) => {
    const novaMensagem = e.target.value;
    if (novaMensagem.length <= 300) {
      setMensagem(novaMensagem);
    }
  };

  return (
    <div className="form-message">
      <h2>Envie-nos uma mensagem</h2>
      <form onSubmit={enviarMensagem}>
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={nome}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setNome(e.target.value);
              }
            }}
            maxLength={20} // Limita diretamente no input
            placeholder="Máximo de 20 caracteres"
          />
        </div>


        <div className="form-group">
          <label htmlFor="title">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            value={mensagem}
            onChange={handleMensagemChange}
          />
          <div className="contador">
            <p>Máx: 300 caracteres</p>
            <p>{mensagem.length} / 300</p>
          </div>
        </div>

        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  );
};

export default Contato;
