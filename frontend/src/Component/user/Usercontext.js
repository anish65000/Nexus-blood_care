import React, { createContext, useReducer, useContext, useEffect } from 'react';

const UserContext = createContext();

const initialState = {
  isLoggedIn: false,
  userRole: null,
  username: null,
  userData: {},
  isLoading: false,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true,
        userRole: action.userRole || null,
        username: action.username || null,
        userData: action.userData || {},
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userRole: null,
        username: null,
        userData: {},
        isLoading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      const { userRole } = parsedUserData;

      dispatch({ type: 'LOGIN', userData: parsedUserData, userRole });
    }
  }, []);

  const login = (userRole, username, userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', userRole, username, userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('userData');
    // Optionally, redirect to login page
    // window.location.href = '/user/login';
  };

  const setLoading = (isLoading) => {
    dispatch({ type: 'SET_LOADING', isLoading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', error });
  };

  return (
    <UserContext.Provider value={{ state, login, logout, setLoading, setError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
