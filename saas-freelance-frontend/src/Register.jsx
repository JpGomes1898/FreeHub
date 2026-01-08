import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ChevronRight } from 'lucide-react';
import AuthLayout from './AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://freehub-api.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Conta criada com sucesso! Faça login.');
        navigate('/');
      } else {
        setError(data.error || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Crie sua conta" subtitle="Comece a usar o FreeHub hoje mesmo.">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <label className="text-gray-300 text-sm font-bold ml-1">Eu quero:</label>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'client' })}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              formData.role === 'client' 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg ring-2 ring-blue-500/50' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <User size={24} />
            <span className="text-sm font-bold">Contratar</span>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'provider' })}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
              formData.role === 'provider' 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/50' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Briefcase size={24} />
            <span className="text-sm font-bold">Trabalhar</span>
          </button>
        </div>

        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Seu melhor email"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="password"
            name="password"
            placeholder="Crie uma senha"
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded border border-red-500/20">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white font-bold py-3 rounded-lg transition shadow-lg mt-2 flex items-center justify-center gap-2 disabled:opacity-50 ${
            formData.role === 'client' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
        >
          {isLoading ? 'Criando...' : formData.role === 'client' ? 'Criar Conta de Cliente' : 'Criar Conta de Prestador'} <ChevronRight size={20} />
        </button>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition">
            Já tem uma conta? <span className="text-blue-400 underline">Faça login</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}