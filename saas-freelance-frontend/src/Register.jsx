import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'CLIENTE'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://freehub-api.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar');
      }

      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Crie sua conta" subtitle="Comece a resolver ou trabalhar hoje.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            className="w-full bg-white/10 border border-white/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
          <input
            type="email"
            name="email"
            placeholder="Seu melhor email"
            className="w-full bg-white/10 border border-white/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
          <input
            type="password"
            name="password"
            placeholder="Senha forte"
            className="w-full bg-white/10 border border-white/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            required
          />
        </div>
        <p className="text-xs text-gray-300 mt-1">
          * Mínimo 8 chars, 1 Maiúscula, 1 minúscula, 1 número, 1 especial.
        </p>

        <div className="flex gap-4 mt-2 justify-center">
          <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition">
            <input 
              type="radio" 
              name="userType" 
              value="CLIENTE" 
              checked={formData.userType === 'CLIENTE'} 
              onChange={handleChange}
              className="accent-blue-400 w-4 h-4"
            />
            <span className="text-sm text-gray-200">Quero contratar</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition">
            <input 
              type="radio" 
              name="userType" 
              value="PRESTADOR" 
              checked={formData.userType === 'PRESTADOR'} 
              onChange={handleChange}
              className="accent-blue-400 w-4 h-4"
            />
            <span className="text-sm text-gray-200">Quero trabalhar</span>
          </label>
        </div>

        {error && <div className="text-red-300 text-sm bg-red-900/50 p-2 rounded text-center border border-red-500/50">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-lg mt-4 disabled:opacity-50"
        >
          {isLoading ? 'Criando...' : 'Registrar'}
        </button>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-300 hover:text-white underline">
            Já tem conta? Faça Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}