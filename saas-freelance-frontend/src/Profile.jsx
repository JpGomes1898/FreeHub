import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { User, Mail, Briefcase, DollarSign, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';

export default function MyProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [earnings, setEarnings] = useState({ total: 0, count: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.userType === 'PRESTADOR') {
      fetchEarnings();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`https://freehub-api.onrender.com/earnings/${user.id}`);
      const data = await response.json();
      setEarnings(data);
    } catch (error) {
      console.error("Erro ao buscar extrato:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {}
        <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-sm">
          <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-black">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
            <div className="flex flex-col md:flex-row gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-2"><Mail size={16} /> {user.email}</span>
              <span className="flex items-center gap-2 px-3 py-0.5 bg-white/10 rounded-full w-fit mx-auto md:mx-0">
                <ShieldCheck size={14} className="text-emerald-400"/> 
                {user.userType}
              </span>
            </div>
          </div>
        </div>

        {}
        {user.userType === 'PRESTADOR' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-emerald-400" /> Painel Financeiro
            </h3>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {}
              <div className="bg-emerald-900/10 border border-emerald-500/30 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-1">Faturamento Total</p>
                  <p className="text-4xl font-bold text-white">
                    {loading ? "..." : formatMoney(earnings.total)}
                  </p>
                </div>
                <div className="h-14 w-14 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                  <DollarSign size={28} />
                </div>
              </div>

              {}
              <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Serviços Concluídos</p>
                  <p className="text-4xl font-bold text-white">
                    {loading ? "..." : earnings.count}
                  </p>
                </div>
                <div className="h-14 w-14 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                  <Briefcase size={28} />
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Histórico de Recebimentos</h4>
              
              {earnings.history.length > 0 ? (
                <div className="space-y-4">
                  {earnings.history.map((job) => (
                    <div key={job.id} className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400">
                          <CheckCircleIcon size={20} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{job.title}</p>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <Calendar size={12} /> {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">
                        + {formatMoney(job.budget)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Nenhum ganho registrado ainda. Conclua serviços para ver seu extrato!
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function CheckCircleIcon({size}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}