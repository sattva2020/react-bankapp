// AuthContextProvider.js

import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const initialState = {
  token: null,
  user: null,
	isConfirm: false, 
};

const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
				isConfirm: true,
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (token, user, isConfirm) => {
    dispatch({ type: actionTypes.LOGIN, payload: { token, user, isConfirm } });
  };

  const logout = () => {
    dispatch({ type: actionTypes.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth повинен використовуватися в межах AuthContextProvider');
  }
	return context;
};

export { actionTypes, useAuth, AuthContextProvider };

