import React from 'react';
import './Footer.css';
import { FaInstagram, FaYoutube } from 'react-icons/fa'; // Usando react-icons

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          
          <a href="https://www.instagram.com/radiofamiliasonline/" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={30} />
          </a>
          <a href="https://www.youtube.com/channel/UCN35zhY7Pg1sDyLzFSx0ZUw/" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={30} />
          </a>
        </div>
        <p>© 2025 Radio Famílias On-line. Todos os direitos reservados. Site feito por PublishUp!</p>
      </div>
    </footer>
  );
}

export default Footer;
