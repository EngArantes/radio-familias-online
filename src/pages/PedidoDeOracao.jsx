// src/pages/PedidoDeOracao.jsx
import React, { useState } from 'react';
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import './PedidoDeOracao.css';
import PedidoDeOracaoIMG from '../../src/pedido_de_oracao.png';

const LIMITE_MENSAGEM = 300;
const LIMITE_NOME = 80;

const PedidoDeOracao = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState(null); // { tipo: 'sucesso' | 'erro', texto }

  // Função para enviar o pedido de oração
  const enviarMensagem = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !mensagem.trim()) {
      setStatus({ tipo: 'erro', texto: 'Por favor, preencha seu nome e o pedido de oração.' });
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus({ tipo: 'erro', texto: 'Por favor, informe um e-mail válido ou deixe o campo em branco.' });
      return;
    }

    setEnviando(true);
    setStatus(null);

    try {
      // Adicionando o documento à coleção "Pedidos-de-oracao"
      const mensagensRef = collection(db, "Pedidos-de-oracao");
      await addDoc(mensagensRef, {
        nome: nome.trim(),
        email: email.trim(),
        mensagem: mensagem.trim(),
        data: new Date(),
      });

      // Limpa os campos após o envio
      setNome('');
      setEmail('');
      setMensagem('');
      setStatus({
        tipo: 'sucesso',
        texto: 'Pedido enviado com sucesso! Nossa equipe estará orando por você.',
      });
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      setStatus({
        tipo: 'erro',
        texto: 'Ocorreu um erro ao enviar seu pedido. Tente novamente.',
      });
    } finally {
      setEnviando(false);
    }
  };

  // Função para controlar o número de caracteres da mensagem
  const handleMensagemChange = (e) => {
    setMensagem(e.target.value.slice(0, LIMITE_MENSAGEM));
  };

  const caracteresRestantes = LIMITE_MENSAGEM - mensagem.length;

  return (
    <main className="oracao">
      <header className="oracao__cabecalho">
        <h1>Pedido de oração</h1>
        <p>
          Conte conosco - escreva seu pedido e nossa equipe estará
          intercedendo por você e sua família.
        </p>
      </header>

      <div className="form-message">
        <div className="oracao__hero">
          <img src={PedidoDeOracaoIMG} alt="Mãos em oração" />
        </div>

        <h2>Faça seu pedido de oração!</h2>
        <p className="oracao__privacidade">
          Seu pedido é tratado com carinho e sigilo. O e-mail é opcional —
          preencha apenas se quiser receber uma resposta.
        </p>

        {status && (
          <p
            className={`oracao__status oracao__status--${status.tipo}`}
            role="status"
          >
            {status.texto}
          </p>
        )}

        <form onSubmit={enviarMensagem}>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={LIMITE_NOME}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              E-mail: <span className="oracao__opcional">(opcional)</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensagem">Pedido:</label>
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={handleMensagemChange}
              placeholder="Escreva aqui seu pedido de oração..."
              maxLength={LIMITE_MENSAGEM}
              required
            />
            <div
              className={`contador${
                caracteresRestantes <= 20 ? ' contador--limite' : ''
              }`}
            >
              <span>Máx: {LIMITE_MENSAGEM} caracteres</span>
              <span>
                {mensagem.length} / {LIMITE_MENSAGEM}
              </span>
            </div>
          </div>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar pedido de oração'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PedidoDeOracao;
