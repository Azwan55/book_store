import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { saveToken } from '../utils/auth';
import '../styles/auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.token);
        localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0] }));
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: data.message || 'Login failed' });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toast ref={toast} />
      <Card className="auth-card">
        <h1 className="auth-title">📚 Library System</h1>
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <div className="p-field">
            <label htmlFor="email">Email Address</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              toggleMask
              required
              className="w-full"
            />
          </div>

          <Button
            label={loading ? 'Signing in...' : 'Sign In'}
            icon="pi pi-sign-in"
            loading={loading}
            className="w-full"
            onClick={handleLogin}
          />
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </Card>
    </div>
  );
}
