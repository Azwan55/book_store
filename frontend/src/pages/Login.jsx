import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { saveToken, isLoggedIn } from '../utils/auth';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      saveToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      enqueueSnackbar('Logged in successfully', { variant: 'success' });
      navigate('/');
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || 'Login failed. Check your credentials.',
        { variant: 'error' }
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImg})` }}>
      <div className="backdrop-brightness-75 min-h-screen flex items-start justify-center px-4 pt-20 pb-10 md:pt-24">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">Sign In</h1>
          <form className="p-fluid" onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-semibold text-slate-700">
                Email
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 text-sm font-semibold text-slate-700">
                Password
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                toggleMask
                className="w-full"
                feedback={false}
                required
              />
            </div>
            <Button type="submit" label={loading ? 'Signing in…' : 'Sign In'} className="w-full" loading={loading} />
          </form>
          <div className="mt-5 text-center text-sm text-slate-600">
            Don’t have an account? <Link className="font-semibold text-sky-600" to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
