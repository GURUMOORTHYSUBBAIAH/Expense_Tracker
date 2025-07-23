import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize navigate with a dummy function if not in Router context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = (path) => {
      window.location.href = path;
    };
  }

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
    } else {
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const loadUser = async () => {
    try {
      if (token) {
        const res = await authAPI.getMe(token);
        setUser(res);
        setIsAuthenticated(true);
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const res = await authAPI.login(formData);
      setAuthToken(res.token);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      setAuthToken(res.token);
      await loadUser();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;