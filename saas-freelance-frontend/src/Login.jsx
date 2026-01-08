import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://freehub-api.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // AQUI ESTÁ A CORREÇÃO: Salva o usuário completo e garante que não é undefined
        if (data && data.id) {
            console.log("Login realizado. Salvando usuário:", data);
            localStorage.setItem('user', JSON.stringify(data));
            
            // Redireciona baseado no tipo
            if (data.userType === 'provider' || data.userType === 'PRESTADOR') {
                navigate('/my-projects');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError('Erro: O servidor retornou dados incompletos.');
        }
      } else {
        setError(data.error || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black">
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400 text-sm">Acesse sua conta no FreeHub.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-white transition" size={20} />
              <input
                name="email"
                type="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-white transition" size={20} />
              <input
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" /> : 'Entrar na Plataforma >'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 underline">
              Cadastre-se
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}