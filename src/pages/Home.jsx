// src/pages/Home.jsx
import React from 'react';
import Seo from '../components/Seo';
import './Home.css';
import BannerPrincipal from '../components/BannerPrincipal';
import LeftBanner from '../components/BannerEsquerda';
import RightBanner from '../components/BannerDireita';
import VideosDestaque from "../components/VideosDestaque";
import MensagemDoDia from '../components/MensagemDoDiaExibicao';
import SantoDoDia from '../components/SantoDoDia';

function Home() {
  return (
    <main className="home">
      <Seo
        description="Ouça a Rádio Famílias Online: música católica, oração, santo do dia, mensagem diária, eventos e vídeos. Evangelizando através das ondas da internet."
        path="/"
      />
      {/* Conteúdo principal em 3 colunas: laterais fixas + coluna central */}
      <section className="content-grid">
        {/* Coluna esquerda */}
        <aside className="colunaEsquerda">
          <div className="banner-lateral-wrapper banner-lateral-wrapper--esquerda">
            <span className="banner-lateral-label">Oração</span>
            <LeftBanner />
          </div>
        </aside>

        {/* Coluna central */}
        <div className="colunaCentral">
          <BannerPrincipal />

          <div className="titulo-principal">
            <h1>Evangelizando através das ondas da internet!</h1>
            <p>
              Música, fé e oração para o seu dia — ouça a Rádio Famílias Online
              de onde você estiver.
            </p>
          </div>

          <div className="conteudo-card">
            <MensagemDoDia />
          </div>

          <div className="conteudo-card">
            <SantoDoDia />
          </div>
        </div>

        {/* Coluna direita */}
        <aside className="colunaDireita">
          <div className="banner-lateral-wrapper banner-lateral-wrapper--direita">
            <span className="banner-lateral-label">Fé</span>
            <RightBanner />
          </div>
        </aside>
      </section>

      {/* Seção de vídeos em destaque (full-width) */}
      <section className="video-section">
        <div className="video-section__header">
          <h2 className="TituloVideosDestaque">Vídeos em destaque</h2>
          <p className="video-section__subtitulo">
            Assista às últimas pregações e programas
          </p>
        </div>

        <div className="video-section__content">
          <VideosDestaque />
        </div>
      </section>
    </main>
  );
}

export default Home;
