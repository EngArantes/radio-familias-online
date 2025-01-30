import React, { useState, useEffect } from 'react';
import './Home.css';
import BannerPrincipal from '../components/BannerPrincipal';
import LeftBanner from '../components/BannerEsquerda';
import RightBanner from '../components/BannerDireita';
import VideosDestaque from "../components/VideosDestaque";
import MensagemDoDia from '../components/MensagemDoDiaExibicao';
import SantoDoDia from '../components/SantoDoDia';

function Home() {
  const [videos, setVideos] = useState([
  ]);

  useEffect(() => {
    fetch('/api/videos')
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div className="home">
      <div className="content-grid">
        <div className='colunaEsquerda'>
          {/* Coluna Esquerda */}
          <LeftBanner />
        </div>

        {/* Coluna Central */}
        <div className="colunaCentral">

          <BannerPrincipal />
          <h2>Evangelizando através das ondas da internet!</h2>
          <MensagemDoDia />
          <SantoDoDia />
        </div>

        <div className='colunaDireita'>
        {/* Coluna Direita */}
        <RightBanner />
        </div>
      </div>

      <div className="video-column">
        <h2 className='TituloVideosDestaque'>Vídeos em destaque</h2>
        <div className='VideosDestaque'>
          <VideosDestaque />
        </div>

      </div>
    </div>
  );
}

export default Home;