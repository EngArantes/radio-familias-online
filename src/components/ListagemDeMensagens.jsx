import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import './ListagemDeMensagens.css'

const ListagemDeMensagens = () => {
  const [mensagens, setMensagens] = useState([]);
  const [mensagemAberta, setMensagemAberta] = useState(null);
  const [mensagemExcluir, setMensagemExcluir] = useState(null); // Estado para armazenar a mensagem a ser excluída

  // Função para buscar mensagens do banco de dados
  useEffect(() => {
    const buscarMensagens = async () => {
      try {
        const colecaoRef = collection(db, "Mensagens-recebidas");
        const snapshot = await getDocs(colecaoRef);
        const mensagensList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMensagens(mensagensList);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };
    buscarMensagens();
  }, []);

  // Função para excluir mensagem do Firestore
  const excluirMensagem = async () => {
    if (!mensagemExcluir) return;

    try {
      console.log("Excluindo mensagem com ID:", mensagemExcluir);  // Log para depuração

      // Excluir do Firestore
      await deleteDoc(doc(db, "Mensagens-recebidas", mensagemExcluir)); // Deletar documento da coleção correta

      // Atualizar lista local
      setMensagens(mensagens.filter((mensagem) => mensagem.id !== mensagemExcluir));
      setMensagemExcluir(null); // Limpa a ID da mensagem após a exclusão
    } catch (error) {
      console.error("Erro ao excluir mensagem:", error);
    }
  };

  // Função para abrir a mensagem no modal
  const abrirMensagem = (mensagem) => {
    setMensagemAberta(mensagem);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setMensagemAberta(null);
  };

  // Função para solicitar confirmação de exclusão
  const confirmarExclusao = (id) => {
    // Exibe uma caixa de confirmação
    const confirmar = window.confirm("Tem certeza de que deseja excluir esta mensagem?");
    if (confirmar) {
      setMensagemExcluir(id); // Se confirmado, guarda o id da mensagem
      excluirMensagem(); // Exclui a mensagem do Firestore e atualiza a lista
    }
  };

  return (
    <div className="lista-mensagens">
      <div className="containerMensagens">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Abrir</th>
              <th>Deletar</th>
            </tr>
          </thead>
          <tbody>
            {mensagens.slice(0, 6).map((mensagem) => (
              <tr key={mensagem.id}>
                <td>{mensagem.nome}</td>
                <td>{mensagem.email}</td>
                <td>
                  <button onClick={() => abrirMensagem(mensagem)} className="botaoAbrir">Abrir</button>                
                </td>
                <td>
                  <button onClick={() => confirmarExclusao(mensagem.id)} className="botaoDeletar">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {mensagens.length > 6 && (
        <div className="scroll-message">
          <p>Existem mais mensagens. Role para ver todas.</p>
        </div>
      )}

      {mensagemAberta && (
        <div className="modal">
          <div className="modal-content">
            <h3>{mensagemAberta.titulo}</h3>
            <p><strong>Nome:</strong> {mensagemAberta.nome}</p>
            <p><strong>Mensagem:</strong> {mensagemAberta.mensagem}</p>
            <button className="botaoFechar" onClick={fecharModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListagemDeMensagens;
