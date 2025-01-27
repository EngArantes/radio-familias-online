import './Eventos.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; // Usando o contexto de autenticação

const EventosList = () => {
    const [eventos, setEventos] = useState([]);
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null); // Estado para armazenar a confirmação de exclusão
    const { currentUser } = useAuth(); // Pega o usuário logado
    const navigate = useNavigate(); // Hook de navegação

    useEffect(() => {
        const eventosRef = collection(db, 'eventos');

        const fetchEventos = async () => {
            const snapshot = await getDocs(eventosRef);
            const eventosList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEventos(eventosList);
        };

        fetchEventos();
    }, []);

    // Função para redirecionar para a página de detalhes
    const handleCardClick = (id) => {
        navigate(`/eventos/${id}`);
    };

    // Função para excluir o evento do Firestore
    const handleExcluirEvento = async (id) => {
        try {
            const eventoRef = doc(db, 'eventos', id);
            await deleteDoc(eventoRef);
            setEventos(eventos.filter(evento => evento.id !== id)); // Remover o evento da lista local
            setConfirmacaoExclusao(null); // Limpa a confirmação de exclusão
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
        }
    };

    return (
        <div className="eventos-list">
            <div className="eventos-container">
                {eventos.length > 0 ? (
                    eventos.map((evento) => (
                        <div 
                            key={evento.id} 
                            className="evento-item" 
                            onClick={() => handleCardClick(evento.id)} // Redireciona ao clicar no card
                        >
                            <h3>{evento.nome}</h3>
                            <p><strong>Data:</strong> {new Date(evento.dataInicio).toLocaleString()}</p>
                            <p><strong>Local:</strong> {evento.local}</p>
                            {evento.imagem && (
                                <div className="evento-image">
                                    <img src={evento.imagem} alt={evento.nome} />
                                </div>
                            )}

                            {/* Exibir o botão de excluir somente para usuários logados */}
                            {currentUser && (
                                <button
                                    className="excluir-evento-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Impede o clique de redirecionar
                                        setConfirmacaoExclusao(evento.id); // Exibe a confirmação de exclusão
                                    }}
                                >
                                    Excluir Evento
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Ainda não há eventos.</p>
                )}
            </div>

            {/* Caixa de confirmação */}
            {confirmacaoExclusao && (
                <div className="confirmacao-exclusao">
                    <p>Tem certeza de que deseja excluir este evento?</p>
                    <button className='confirmar'
                        onClick={() => handleExcluirEvento(confirmacaoExclusao)}
                    >
                        Sim, excluir
                    </button>
                    <button className='cancelar'
                        onClick={() => setConfirmacaoExclusao(null)}
                    >
                        Não, cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventosList;
