import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access_token')
      ? JSON.parse(localStorage.getItem('access_token'))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem('access_token')
      ? jwtDecode(JSON.parse(localStorage.getItem('access_token')).access)
      : null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await api.post('/users/login/', {
        email: email,
        password: password,
      });
      const data = response.data;

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('access_token', JSON.stringify(data));
        navigate('/');
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    // This is a simplified auth context. A production application would
    // also need to handle refreshing the JWT token when it expires.
    if (authTokens) {
        setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
