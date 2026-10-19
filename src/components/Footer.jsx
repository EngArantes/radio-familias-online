import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaInstagram, FaYoutube, FaArrowUp, FaBroadcastTower } from 'react-icons/fa';

function Footer() {
  const anoAtual = new Date().getFullYear();

  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Coluna 1 — Marca */}
        <div className="footer__marca">
          <p className="footer__logo">
            <span className="footer__logo-icone" aria-hidden="true">
              <FaBroadcastTower />
            </span>
            Rádio Famílias Online
          </p>
          <p className="footer__tagline">
            Evangelizando através das ondas da internet!
          </p>
          <div className="footer__social">
            <a
              href="https://www.instagram.com/radiofamiliasonline/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Rádio Famílias Online"
              className="footer__social-btn"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.youtube.com/channel/UCN35zhY7Pg1sDyLzFSx0ZUw/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube da Rádio Famílias Online"
              className="footer__social-btn"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Coluna 2 — Navegação */}
        <nav className="footer__col" aria-label="Navegação do rodapé">
          <p className="footer__titulo">Navegação</p>
          <ul className="footer__links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/videos-gallery">Vídeos</Link></li>
            <li><Link to="/contato">Contato</Link></li>
          </ul>
        </nav>

        {/* Coluna 3 — Fé e comunidade */}
        <nav className="footer__col" aria-label="Fé e comunidade">
          <p className="footer__titulo">Fé e comunidade</p>
          <ul className="footer__links">
            <li><Link to="/pedido-de-oracao">Pedido de Oração</Link></li>
            <li><Link to="/politicas">Termos de Uso e Privacidade</Link></li>
          </ul>
          <button
            type="button"
            className="footer__topo"
            onClick={voltarAoTopo}
            aria-label="Voltar ao topo da página"
          >
            <FaArrowUp aria-hidden="true" /> Voltar ao topo
          </button>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>© 2024-{anoAtual} Rádio Famílias Online. Todos os direitos reservados.</p>
        <p className="footer__creditos">Site feito por PublishUp!</p>
      </div>
    </footer>
  );
}

export default Footer;
