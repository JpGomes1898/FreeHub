import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { DollarSign, CheckCircle, Clock, Briefcase, Wallet } from 'lucide-react';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const response = await fetch('https://freehub-api.onrender.com/services');
      const data = await response.json();
      
      const myServices = data.filter(service => 
        service.providerId === user.id
      );
      
      setProjects(myServices);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishService = async (serviceId) => {
    if(!confirm("Confirmar que recebeu o pagamento e finalizar o serviço?")) return;

    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${serviceId}/finish`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        alert("Serviço finalizado e valor adicionado à carteira!");
        fetchMyProjects();
      }
    } catch (error) {
      console.error("Erro ao finalizar:", error);
    }
  };

  const completedProjects = projects.filter(p => p.status === 'finished');
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'accepted');
  
  const totalEarnings = completedProjects.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-[#1e1e24] p-8 rounded-3xl border border-white/5 flex items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg z-10">
            {user.name?.charAt(0)}
          </div>
          <div className="z-10">
            <h2 className="text-3xl font-bold text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                <Briefcase size={12} /> Prestador
              </span>
              <span className="text-gray-400 text-sm">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#1e1e24] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition">
            <div className="absolute right-4 top-4 p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition">
              <DollarSign size={24} />
            </div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Faturamento Total</p>
            <h3 className="text-4xl font-bold text-white mt-2">
              R$ {totalEarnings.toFixed(2).replace('.', ',')}
            </h3>
            <p className="text-emerald-500 text-xs mt-2 font-medium flex items-center gap-1">
              <Wallet size={12} /> Valor recebido em conta
            </p>
          </div>

          <div className="bg-[#1e1e24] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition">
            <div className="absolute right-4 top-4 p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition">
              <CheckCircle size={24} />
            </div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Serviços Concluídos</p>
            <h3 className="text-4xl font-bold text-white mt-2">
              {completedProjects.length}
            </h3>
            <p className="text-blue-400 text-xs mt-2 font-medium">Projetos entregues com sucesso</p>
          </div>

          <div className="bg-[#1e1e24] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-yellow-500/30 transition">
            <div className="absolute right-4 top-4 p-3 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition">
              <Clock size={24} />
            </div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Em Andamento</p>
            <h3 className="text-4xl font-bold text-white mt-2">
              {activeProjects.length}
            </h3>
            <p className="text-yellow-500 text-xs mt-2 font-medium">Trabalhos ativos agora</p>
          </div>

        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="text-gray-400" size={20} />
            Histórico de Recebimentos e Projetos
          </h3>

          {loading ? (
            <div className="text-center py-10 text-gray-500">Carregando carteira...</div>
          ) : projects.length === 0 ? (
            <div className="bg-white/5 p-10 rounded-2xl text-center border border-dashed border-white/10">
              <p className="text-gray-400">Você ainda não pegou nenhum serviço.</p>
              <p className="text-sm text-gray-500 mt-2">Vá ao Mural de Serviços e aceite sua primeira oportunidade!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-[#18181b] p-6 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition">
                  
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full mt-1 ${
                      project.status === 'finished' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {project.status === 'finished' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{project.title}</h4>
                      <p className="text-gray-400 text-sm line-clamp-1">{project.description}</p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded border ${
                          project.status === 'finished' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                          {project.status === 'finished' ? 'CONCLUÍDO & PAGO' : 'EM ANDAMENTO'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Cliente: {project.client?.name || 'Cliente'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[150px]">
                    <span className={`text-xl font-bold ${
                      project.status === 'finished' ? 'text-emerald-400' : 'text-white'
                    }`}>
                      + R$ {Number(project.price).toFixed(2).replace('.', ',')}
                    </span>
                    
                    {project.status !== 'finished' && (
                      <button 
                        onClick={() => handleFinishService(project.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition w-full"
                      >
                        Finalizar Serviço
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}