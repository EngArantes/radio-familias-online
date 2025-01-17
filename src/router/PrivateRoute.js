import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importando o hook de autenticação

const PrivateRoute = ({ element, ...rest }) => {
  const { currentUser } = useAuth(); // Pegando o usuário autenticado através do contexto

  if (!currentUser) {
    return <Navigate to="/" />; // Redireciona para Home se não estiver autenticado
  }

  return element;
};

export default PrivateRoute;
