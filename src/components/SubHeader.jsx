import React from 'react';
import { Link } from 'react-router-dom';
import './SubHeader.css';
import Logomarca from '../logomarca_fundo_azul.png';
import LogomarcaDivino from '../logo_divino.png';

function Header() {
  return (
    <header className="SubHeader">
        <Link to="/">
        <img className="logomarcaTop" src={Logomarca} alt="logomarca" />
        </Link>
         
      <img className='logomarcaDivino' src={LogomarcaDivino} alt="Logomarca-Divino-Espirito-Santo"/>
    </header>

  );
}

export default Header;
