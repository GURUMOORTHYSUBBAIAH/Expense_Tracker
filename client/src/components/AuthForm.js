import axios from 'axios';
import React, { useState } from 'react';
import './AuthForm.css'; // custom styles here

function AuthForm({ setToken }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'https://expense-tracker-68qa.onrender.com/api/auth/login' : 'https://expense-tracker-68qa.onrender.com/api/auth/register';

    try {
      const res = await axios.post(url, form);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); //  Use setToken instead of onLogin
    } catch (err) {
      console.error("API Error:", err);
      alert(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-bg d-flex justify-content-center align-items-center">
      <div className="auth-card shadow-lg p-4 rounded-4 bg-white w-100">
        <h3 className="text-center mb-4 fw-bold text-primary">{isLogin ? 'Login' : 'Register'}</h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              className="form-control mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="form-control mb-4"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn btn-primary w-100 rounded-3">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="mt-3 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <br />
          <button type="button" className="btn btn-sm btn-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
