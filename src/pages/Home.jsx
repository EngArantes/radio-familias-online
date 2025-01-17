import React, { useState, useEffect } from 'react';
import './Home.css';
import BannerPrincipal from '../components/BannerPrincipal';
import LeftBanner from '../components/BannerEsquerda';
import RightBanner from '../components/BannerDireita';
import VideosDestaque from "../components/VideosDestaque";
import MensagemDoDia from '../components/MensagemDoDiaExibicao';

function Home() {
  const [videos, setVideos] = useState([
    { id: 1, videoId: 'fA6VFGP2ZGc', title: 'Vídeo 1' },
    { id: 2, videoId: 'uow54Rc01kU', title: 'Vídeo 2' },
    { id: 3, videoId: 'QbpKnSFALWY', title: 'Vídeo 3' },
    { id: 4, videoId: 'FBPyjVN-wh8', title: 'Vídeo 4' },
  ]);

  useEffect(() => {
    fetch('/api/videos')
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div className="home">
      <div className="content-grid">
        {/* Coluna Esquerda */}
        <LeftBanner />

        {/* Coluna Central */}
        <div className="colunaCentral">

          <BannerPrincipal />
          <h2>Evangelizando através das ondas da internet!</h2>
          <MensagemDoDia />

          <div className="player">
            <iframe className='playerIframe'
              src="https://stream-176.zeno.fm/mvwnqucijectv?zt=eyJhbGciOiJIUzI1NiJ9.eyJzdHJlYW0iOiJtdnducXVjaWplY3R2IiwiaG9zdCI6InN0cmVhbS0xNzYuemVuby5mbSIsInJ0dGwiOjUsImp0aSI6IjZfWjJwMUdRU1BLU3pYUTljS0VEU1EiLCJpYXQiOjE3MzY4ODQxMDUsImV4cCI6MTczNjg4NDE2NX0.5oqGrzKilfMQW4HWxUr1ARJPhFVu7bpsRzSMO-m7src"
              title="Radio Player"
              frameBorder="0"
              allow="autoplay"
            ></iframe>
            <h2 className='textoPlay'>Pressione o botão <strong>PLAY</strong> para reproduzir a rádio.</h2>
          </div>
        </div>

        {/* Coluna Direita */}
        <RightBanner />
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