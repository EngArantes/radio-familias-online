import './Eventos.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext'; // Usando o contexto de autenticação

const extrairCaminhoStorage = (url) => {
  if (!url) return '';
  try {
    const parte = url.split('/o/')[1]?.split('?')[0] ?? '';
    return decodeURIComponent(parte);
  } catch {
    return '';
  }
};

const excluirImagemEvento = async (imagemUrl) => {
  const caminho = extrairCaminhoStorage(imagemUrl);
  if (!caminho) return;
  try {
    await deleteObject(ref(storage, caminho));
    console.log('Imagem do evento excluída com sucesso.');
  } catch (error) {
    console.warn('Não foi possível excluir a imagem do evento:', error.message);
  }
};
const formatarData = (valor) => {
  if (!valor) return 'Data a definir';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return 'Data a definir';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatarHora = (valor) => {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const EventosList = () => {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const { currentUser } = useAuth(); // Pega o usuário logado
  const navigate = useNavigate(); // Hook de navegação

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventosRef = collection(db, 'eventos');
        const snapshot = await getDocs(eventosRef);
        const eventosList = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        // Próximos eventos primeiro
        eventosList.sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));
        setEventos(eventosList);
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        setErro('Não foi possível carregar os eventos. Tente novamente mais tarde.');
      } finally {
        setCarregando(false);
      }
    };

    fetchEventos();
  }, []);

  // Fecha o modal de confirmação com a tecla Esc
  useEffect(() => {
    if (!confirmacaoExclusao) return;
    const aoTeclar = (e) => {
      if (e.key === 'Escape') setConfirmacaoExclusao(null);
    };
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [confirmacaoExclusao]);

  // Função para redirecionar para a página de detalhes
  const handleCardClick = (id) => {
    navigate(`/eventos/${id}`);
  };

  const handleCardKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(id);
    }
  };

  // Função para excluir o evento do Firestore (e a imagem do Storage)
  const handleExcluirEvento = async (id) => {
    if (!id || excluindo) return;
    setExcluindo(true);
    try {
      const evento = eventos.find((item) => item.id === id);
      const eventoRef = doc(db, 'eventos', id);
      await deleteDoc(eventoRef);
      // A imagem só é excluída DEPOIS que o documento foi removido.
      // Se a exclusão falhar, apenas avisamos no console (não quebra a exclusão).
      await excluirImagemEvento(evento?.imagem);
      setEventos((lista) => lista.filter((evento) => evento.id !== id));
      setConfirmacaoExclusao(null);
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert(`Não foi possível excluir o evento: ${error.message}`);
    } finally {
      setExcluindo(false);
    }
  };

  const eventoEmConfirmacao = confirmacaoExclusao
    ? eventos.find((evento) => evento.id === confirmacaoExclusao)
    : null;


  return (
    <main className="eventos-page">
      <div className="eventos__inner">
        <header className="eventos__cabecalho">
          <div className="eventos__titulo">
            <h1>Eventos</h1>
            <p>Acompanhe a agenda da comunidade: celebrações, encontros e momentos de fé.</p>
          </div>
          <span className="eventos__contador" aria-live="polite">
            {carregando ? 'Carregando…' : `${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'}`}
          </span>
        </header>

        {carregando && (
          <div className="eventos__grid" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="evento-card evento-card--skeleton">
                <div className="evento-card__midia" />
                <div className="evento-card__corpo">
                  <div className="skeleton skeleton--titulo" />
                  <div className="skeleton" />
                  <div className="skeleton skeleton--curta" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!carregando && erro && (
          <div className="eventos__estado" role="alert">
            <p className="eventos__estado-titulo">Algo não saiu como esperado</p>
            <p>{erro}</p>
          </div>
        )}

        {!carregando && !erro && eventos.length === 0 && (
          <div className="eventos__estado">
            <p className="eventos__estado-titulo">Ainda não há eventos</p>
            <p>Volte em breve para conferir a agenda da comunidade.</p>
          </div>
        )}

        {!carregando && !erro && eventos.length > 0 && (
          <div className="eventos__grid">
            {eventos.map((evento) => (
              <article
                key={evento.id}
                className="evento-card"
                onClick={() => handleCardClick(evento.id)}
                onKeyDown={(e) => handleCardKeyDown(e, evento.id)}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalhes de ${evento.nome}`}
              >
                {evento.imagem ? (
                  <div className="evento-card__midia">
                    <img src={evento.imagem} alt={evento.nome} loading="lazy" />
                    <span className="evento-card__data">{formatarData(evento.dataInicio)}</span>
                  </div>
                ) : (
                  <div className="evento-card__midia evento-card__midia--vazia" aria-hidden="true">
                    <span className="evento-card__data">{formatarData(evento.dataInicio)}</span>
                  </div>
                )}

                <div className="evento-card__corpo">
                  <h3>{evento.nome}</h3>
                  <ul className="evento-card__meta">
                    <li>
                      <span aria-hidden="true">📅</span> {formatarData(evento.dataInicio)}
                      {formatarHora(evento.dataInicio) && ` · ${formatarHora(evento.dataInicio)}`}
                    </li>
                    {evento.local && (
                      <li>
                        <span aria-hidden="true">📍</span> {evento.local}
                      </li>
                    )}
                  </ul>
                  {evento.descricao && (
                    <p className="evento-card__descricao">{evento.descricao}</p>
                  )}

                  <div className="evento-card__acoes">
                    <span className="evento-card__ver">Ver detalhes →</span>
                    {currentUser && (
                      <button
                        type="button"
                        className="evento-card__excluir"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmacaoExclusao(evento.id);
                        }}
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {confirmacaoExclusao && (
        <div
          className="evento-modal__overlay"
          onClick={() => !excluindo && setConfirmacaoExclusao(null)}
        >
          <div
            className="evento-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="excluir-evento-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="excluir-evento-titulo">Excluir evento</h2>
            <p>
              Tem certeza de que deseja excluir{' '}
              <strong>{eventoEmConfirmacao?.nome ?? 'este evento'}</strong>? Essa ação não pode
              ser desfeita.
            </p>
            <div className="evento-modal__acoes">
              <button
                type="button"
                className="confirmar"
                disabled={excluindo}
                onClick={() => handleExcluirEvento(confirmacaoExclusao)}
              >
                {excluindo ? 'Excluindo…' : 'Sim, excluir'}
              </button>
              <button
                type="button"
                className="cancelar"
                disabled={excluindo}
                onClick={() => setConfirmacaoExclusao(null)}
              >
                Não, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EventosList;
