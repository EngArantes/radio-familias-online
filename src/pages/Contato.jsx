// src/pages/Contato.jsx
import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './Contato.css';

const LIMITE_MENSAGEM = 300;

const Contato = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState(null); // { tipo: 'sucesso' | 'erro', texto }

  // Função para enviar a mensagem
  const enviarMensagem = async (e) => {
    e.preventDefault();

    // Verificando se os campos estão preenchidos
    if (!nome.trim() || !email.trim() || !mensagem.trim()) {
      setStatus({ tipo: 'erro', texto: 'Por favor, preencha todos os campos.' });
      return;
    }

    setEnviando(true);
    setStatus(null);

    try {
      // Adicionando o documento à coleção "Mensagens-recebidas"
      const mensagensRef = collection(db, 'Mensagens-recebidas');
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
        texto: 'Mensagem enviada com sucesso! Em breve retornaremos o contato.',
      });
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      setStatus({
        tipo: 'erro',
        texto: 'Ocorreu um erro ao enviar a mensagem. Tente novamente.',
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
    <main className="contato">
      <header className="contato__cabecalho">
        <h1>Fale com a gente</h1>
        <p>
          Envie sua mensagem, sugestão ou testemunho — lemos todas as
          mensagens recebidas.
        </p>
      </header>

      <div className="form-message">
        <h2>Mande-nos uma mensagem!</h2>

        {status && (
          <p
            className={`contato__status contato__status--${status.tipo}`}
            role="status"
          >
            {status.texto}
          </p>
        )}

        <form onSubmit={enviarMensagem}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={80}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              value={mensagem}
              onChange={handleMensagemChange}
              placeholder="Escreva sua mensagem aqui..."
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
            {enviando ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contato;
