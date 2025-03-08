// src/pages/Dashboard.jsx
import React from 'react';
import { usePlayer } from '../contexts/PlayerContext'; // Usando o contexto do player
import AddBannerPrincipal from '../components/AddBannerPrincipal';
import './Dashboard.css'; // Certifique-se de ter esse arquivo CSS para os estilos
import AddLeftRightBanners from '../components/AddLeftRightBanners'; 
import AddVideos from '../components/AddVideos';
import AddMensagemDoDia from '../components/AddMensagemDoDia';
import ListagemDeMensagens from '../components/ListagemDeMensagens';
import SantoDoDia from '../components/AddSantoDoDia';
import AddEventos from '../components/AddEventos';
import ListagePedidosDeOracao from '../components/ListarPedidosDeOracao';
import ToggleSwitch from '../components/SwitchPlayer';

function Dashboard() {
    const { isPlayerActive, togglePlayer } = usePlayer(); // Acessando o estado do player
  
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* Switch para ativar/desativar o player */}
      <div className="player-toggle">
        <h2>Desativar/Ativar Player de Música</h2>
        <ToggleSwitch checked={isPlayerActive} onChange={togglePlayer} />
      </div>
      
      {/* Estrutura de 3 colunas */}
      <div className="dashboard-columns">
        <div className="column">
          {/* Aqui você pode adicionar qualquer outro conteúdo */}
          <h2>Banner Principal</h2>
          <AddBannerPrincipal />
        </div>

        <div className="column">
          {/* Coluna do formulário para adicionar o banner */}
          <h2>Banner Esquerdo</h2>
          <AddLeftRightBanners bannerType="leftBanner" />
          
        </div>

        <div className="column">
          {/* Aqui você pode adicionar outro conteúdo */}
          <h2>Banner Direito</h2>
          <AddLeftRightBanners bannerType="rightBanner" />
        </div>
      </div>


      {/* Segunda linha */}
      <div className="dashboard-columns">
        <div className="column">
          {/* Aqui você pode adicionar qualquer outro conteúdo */}
          <h2>Adicionar Vídeos</h2>
          <AddVideos/>
        </div>

        <div className="column">
          {/* Coluna do formulário para adicionar o banner */}
          <h2>Adicionar mensagem do dia</h2>
          <AddMensagemDoDia/>
        </div>

        <div className="column">
          {/* Aqui você pode adicionar outro conteúdo */}
          <h2>Mensagens Recebidas</h2>
          <ListagemDeMensagens/>
        </div>
        
      </div>

      {/* Terceira linha */}
      <div className="dashboard-columns">
      <div className="column">
          {/* Aqui você pode adicionar outro conteúdo */}
          <h2>Santo do Dia</h2>
          <SantoDoDia/>
        </div>

        <div className="column">
          {/* Coluna do formulário para adicionar o banner */}
          <h2>Adicionar Evento</h2>
          <AddEventos/>
        </div>

        <div className="column">
          {/* Aqui você pode adicionar outro conteúdo */}
          <h2>Pedidos de oração recebidos</h2>
          <ListagePedidosDeOracao/>
        </div>        
        
      </div>
    </div>
  );
}

export default Dashboard;
