import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Briefcase, Lock, Mail, Loader, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estado para controlar o tipo (client ou provider)
  const [userType, setUserType] = useState('client'); 

  const [formData, setFormData] = useState({
    name: '',
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
      const response = await fetch('https://freehub-api.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // AQUI ESTAVA O ERRO: Agora enviamos o userType junto!
        body: JSON.stringify({
          ...formData,
          userType: userType === 'client' ? 'client' : 'provider'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salva e redireciona
        localStorage.setItem('user', JSON.stringify(data));
        if (data.userType === 'provider') {
            navigate('/my-projects');
        } else {
            navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Erro ao criar conta.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-black">
      {/* Imagem de Fundo */}
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
            <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
            <p className="text-gray-400 text-sm">Comece a usar o FreeHub hoje mesmo.</p>
          </div>

          {/* Seleção de Tipo de Conta */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Eu quero:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  userType === 'client' 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <User size={24} />
                <span className="text-sm font-bold">Contratar</span>
              </button>

              <button
                type="button"
                onClick={() => setUserType('provider')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  userType === 'provider' 
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Briefcase size={24} />
                <span className="text-sm font-bold">Trabalhar</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-white transition" size={20} />
                <input
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

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
              className={`w-full font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 ${
                userType === 'client' 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {loading ? <Loader className="animate-spin" /> : (
                userType === 'client' ? 'Criar Conta de Cliente >' : 'Criar Conta de Prestador >'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Já tem uma conta?{' '}
            <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
              Faça login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}