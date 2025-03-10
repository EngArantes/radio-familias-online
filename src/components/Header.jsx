import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../contexts/AuthContext';
import Player from '../components/Player';
import PedidoDeOracaoIMG from '../../src/pedido_de_oracao.png';
import { usePlayer } from '../contexts/PlayerContext'; // Usando o contexto do player


function Header() {
  const { isPlayerActive } = usePlayer(); // Acessando o estado do player  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para fechar o menu ao clicar no link
  const handleLinkClick = () => {
    setIsMenuOpen(false); // Fecha o menu
  };

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

  return (
    <>
      <header className="header">

        <nav>
          <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
            {/* Adicionando o link com imagem e texto abaixo */}
            <li className="pedido-oracao">
              <Link to="/pedido-de-oracao" onClick={handleLinkClick}>
                <img src={PedidoDeOracaoIMG} alt="Pedido de Oração" className="pedido-oracao-img" />
                <p>Pedido de Oração</p>
              </Link>
            </li>
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/eventos" onClick={handleLinkClick}>Eventos</Link></li>
            <li><Link to="/videos-gallery" onClick={handleLinkClick}>Vídeos</Link></li>
            <li><Link to="/contato" onClick={handleLinkClick}>Contato</Link></li>

            {currentUser && (
              <li><Link to="/dashboard" className="nav-link" onClick={handleLinkClick}>Dashboard</Link></li>
            )}

            {currentUser ? (
              <li><button onClick={handleLogout} className="login-button">Sair</button></li>
            ) : (
              <li><button onClick={toggleModal} className="login-button">Login</button></li>
            )}


          </ul>
        </nav>

        {isPlayerActive && <Player />}
        <button className="menu-button" onClick={toggleMenu}>
          ☰
        </button>
      </header>


      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>
              <button type="submit" className="submit-button">Entrar</button>
            </form>
            <button className="close-button" onClick={toggleModal}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
