// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';
import Player from '../components/Player';
import PedidoDeOracaoIMG from '../../src/pedido_de_oracao.png';
import { usePlayer } from '../contexts/PlayerContext'; // Usando o contexto do player

function Header() {
  const { isPlayerActive } = usePlayer(); // Acessando o estado do player
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Sombra sutil na barra ao rolar a página
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu móvel ao trocar de rota
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Fecha menu/modal com a tecla Esc (devolve o foco ao botão do menu)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setShowModal(false);
      if (isMenuOpen) {
        setIsMenuOpen(false);
        if (menuButtonRef.current) menuButtonRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  // Fecha o menu ao clicar fora do header
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [isMenuOpen]);

  const toggleModal = () => setShowModal(!showModal);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Função para fechar o menu ao clicar no link
  const handleLinkClick = () => setIsMenuOpen(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toggleModal();
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      alert('Erro ao fazer logout: ' + error.message);
    }
  };

  // Destaca o link da página atual
  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? ' nav-link--active' : ''}`;

  return (
    <>
      <header
        ref={headerRef}
        className={`header${scrolled ? ' header--scrolled' : ''}`}
      >
        <div className="header__inner">
          <button
            ref={menuButtonRef}
            type="button"
            className={`menu-button${isMenuOpen ? ' menu-button--open' : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
            aria-controls="menu-principal"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className={`header__nav${isMenuOpen ? ' header__nav--open' : ''}`} aria-label="Navegação principal">
            <ul
              id="menu-principal"
              className={`nav-links${isMenuOpen ? ' show' : ''}`}
            >
              <li className="pedido-oracao">
                <NavLink
                  to="/pedido-de-oracao"
                  className={linkClass}
                  onClick={handleLinkClick}
                >
                  <img
                    src={PedidoDeOracaoIMG}
                    alt=""
                    className="pedido-oracao-img"
                  />
                  <span>Pedido de Oração</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/" end className={linkClass} onClick={handleLinkClick}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/eventos" className={linkClass} onClick={handleLinkClick}>
                  Eventos
                </NavLink>
              </li>
              <li>
                <NavLink to="/videos-gallery" className={linkClass} onClick={handleLinkClick}>
                  Vídeos
                </NavLink>
              </li>
              <li>
                <NavLink to="/contato" className={linkClass} onClick={handleLinkClick}>
                  Contato
                </NavLink>
              </li>

              {currentUser && (
                <li>
                  <NavLink to="/dashboard" className={linkClass} onClick={handleLinkClick}>
                    Dashboard
                  </NavLink>
                </li>
              )}

              <li className="header__auth">
                {currentUser ? (
                  <button type="button" onClick={handleLogout} className="login-button">
                    Sair
                  </button>
                ) : (
                  <button type="button" onClick={toggleModal} className="login-button">
                    Login
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {isPlayerActive && (
            <div className="header__player">
              <Player />
            </div>
          )}
        </div>
      </header>

      {showModal && (
        <div className="login-modal-overlay" onClick={toggleModal}>
          <div
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-titulo"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="login-titulo">Login</h2>
            <p className="login-modal__subtitulo">Área restrita da equipe da rádio.</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Entrar
              </button>
            </form>

            <button type="button" className="close-button" onClick={toggleModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;

