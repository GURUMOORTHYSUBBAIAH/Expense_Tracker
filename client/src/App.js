import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded); // 👈 Check this
        setUser(decoded); // { name, userId, email, etc. }
      } catch (err) {
        console.error('Invalid token');
        setToken(null);
      }
    }
  }, [token]);
  

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-secondary" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />} {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      {!token ? (
        <AuthForm setToken={setToken} />
      ) : (
        <Dashboard token={token} setToken={setToken} theme={theme} user={user} />
      )}
    </div>
  );
}

export default App;
