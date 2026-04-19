import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { saveToken, isLoggedIn } from '../utils/auth';
import bgImg from '../assets/pngtree-bookstore-image_834987.jpg';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter a valid email address.' });
      return;
    }

    if (password.length < 6) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        name,
        email,
        password,
      });

      saveToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Account created successfully.' });
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Registration failed. Try again.';
      toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImg})` }}>
      <Toast ref={toast} />
      <div className="backdrop-brightness-75 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl">
          <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">Create Account</h1>
          <form className="p-fluid" onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full"
                required
                disabled={loading}
              />
            </div>
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
                disabled={loading}
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
                placeholder="Choose a secure password"
                toggleMask
                className="w-full"
                feedback={false}
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              label={loading ? 'Creating account…' : 'Create Account'}
              className="w-full"
              loading={loading}
              disabled={loading}
            />
          </form>
          <div className="mt-5 text-center text-sm text-slate-600">
            Already have an account? <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
