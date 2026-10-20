// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext'; // Usando o contexto do player
import { Images, Newspaper, MessageSquare, CalendarPlus } from 'lucide-react';
import AddBannerPrincipal from '../components/AddBannerPrincipal';
import AddLeftRightBanners from '../components/AddLeftRightBanners';
import AddVideos from '../components/AddVideos';
import AddMensagemDoDia from '../components/AddMensagemDoDia';
import ListagemDeMensagens from '../components/ListagemDeMensagens';
import SantoDoDia from '../components/AddSantoDoDia';
import AddEventos from '../components/AddEventos';
import ListagePedidosDeOracao from '../components/ListarPedidosDeOracao';
import ToggleSwitch from '../components/SwitchPlayer';
import Seo from '../components/Seo';
// Importado por último para que os estilos do painel tenham precedência
// sobre os estilos legados dos componentes filhos
import './Dashboard.css';

/* Card de painel: apenas um wrapper estilizado dos componentes filhos */
function Painel({ titulo, descricao, icone, children }) {
  return (
    <article className="painel">
      <header className="painel__header">
        {icone && <span className="painel__icone">{icone}</span>}
        <div className="painel__titulo">
          <h2>{titulo}</h2>
          {descricao && <p>{descricao}</p>}
        </div>
      </header>
      <div className="painel__corpo">{children}</div>
    </article>
  );
}

/* Abas do dashboard (agrupamento por área de gestão) */
const ABAS = [
  { id: 'banners', label: 'Banners', icone: <Images size={16} /> },
  { id: 'conteudo', label: 'Conteúdo', icone: <Newspaper size={16} /> },
  { id: 'mensagens', label: 'Mensagens', icone: <MessageSquare size={16} /> },
  { id: 'eventos', label: 'Eventos', icone: <CalendarPlus size={16} /> },
];

function Dashboard() {
  const { isPlayerActive, togglePlayer } = usePlayer(); // Acessando o estado do player
  const [abaAtiva, setAbaAtiva] = useState('banners');

  return (
    <main className="dashboard">
      <Seo title="Dashboard" path="/dashboard" noindex />
      {/* Cabeçalho do painel */}
      <header className="dashboard-header">
        <div className="dashboard-header__texto">
          <span className="dashboard-header__sobre">Painel administrativo</span>
          <h1>Dashboard</h1>
          <p>
            Gerencie banners, conteúdo e mensagens da Rádio Famílias Online em
            um só lugar.
          </p>
        </div>

        {/* Switch para ativar/desativar o player de música */}
        <div className="player-toggle">
          <div className="player-toggle__info">
            <span className="player-toggle__titulo">Player de música</span>
            <span
              className={`player-toggle__status${
                isPlayerActive ? ' player-toggle__status--ativo' : ''
              }`}
            >
              {isPlayerActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <ToggleSwitch checked={isPlayerActive} onChange={togglePlayer} />
        </div>
      </header>

      {/* Navegação por abas */}
      <nav className="dashboard-tabs" aria-label="Seções do dashboard">
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            type="button"
            className={`dashboard-tab${
              abaAtiva === aba.id ? ' dashboard-tab--ativa' : ''
            }`}
            onClick={() => setAbaAtiva(aba.id)}
            aria-current={abaAtiva === aba.id ? 'page' : undefined}
          >
            {aba.icone}
            <span>{aba.label}</span>
          </button>
        ))}
      </nav>

      {/* Conteúdo da aba ativa */}
      <section className="dashboard-conteudo">
        {abaAtiva === 'banners' && (
          <div className="painel-grid">
            <Painel
              titulo="Banner Principal"
              descricao="Imagem larga exibida no topo da página inicial."
              icone={<Images size={18} />}
            >
              <AddBannerPrincipal />
            </Painel>

            <Painel
              titulo="Banner Esquerdo"
              descricao="Anúncio da coluna lateral esquerda da página inicial."
              icone={<Images size={18} />}
            >
              <AddLeftRightBanners bannerType="leftBanner" />
            </Painel>

            <Painel
              titulo="Banner Direito"
              descricao="Anúncio da coluna lateral direita da página inicial."
              icone={<Images size={18} />}
            >
              <AddLeftRightBanners bannerType="rightBanner" />
            </Painel>
          </div>
        )}

        {abaAtiva === 'conteudo' && (
          <div className="painel-grid">
            <Painel
              titulo="Adicionar vídeo"
              descricao="Publique um vídeo no canal do YouTube da rádio."
              icone={<Newspaper size={18} />}
            >
              <AddVideos />
            </Painel>

            <Painel
              titulo="Mensagem do dia"
              descricao="Mensagem exibida na coluna central da página inicial."
              icone={<Newspaper size={18} />}
            >
              <AddMensagemDoDia />
            </Painel>

            <Painel
              titulo="Santo do dia"
              descricao="Santo do dia exibido na coluna central da página inicial."
              icone={<Newspaper size={18} />}
            >
              <SantoDoDia />
            </Painel>
          </div>
        )}

        {abaAtiva === 'mensagens' && (
          <div className="painel-grid">
            <Painel
              titulo="Mensagens recebidas"
              descricao="Contatos enviados pelo formulário do site."
              icone={<MessageSquare size={18} />}
            >
              <ListagemDeMensagens />
            </Painel>

            <Painel
              titulo="Pedidos de oração"
              descricao="Pedidos de oração enviados pelos ouvintes."
              icone={<MessageSquare size={18} />}
            >
              <ListagePedidosDeOracao />
            </Painel>
          </div>
        )}

        {abaAtiva === 'eventos' && (
          <div className="painel-grid painel-grid--estreito">
            <Painel
              titulo="Adicionar evento"
              descricao="Crie um evento para a página de Eventos do site."
              icone={<CalendarPlus size={18} />}
            >
              <AddEventos />
            </Painel>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;

