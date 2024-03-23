import "./index.css";

import React from 'react';
import { useAuth } from '../AuthContextProvider';
import { Route, Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const { state } = useAuth();

  return state.token ? <Navigate to="/balance" /> : <>{children}</>;
};

export default AuthRoute;


