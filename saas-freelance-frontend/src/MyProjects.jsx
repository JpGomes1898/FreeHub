import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ServiceDetailsModal from './ServiceDetailsModal';
import { CheckCircle, Clock, MapPin, Trophy } from 'lucide-react';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyProjects();
  }, [user.id]);

  async function fetchMyProjects() {
    try {
      const response = await fetch(`https://freehub-api.onrender.com/my-projects/${user.id}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Erro ao buscar projetos", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFinish = async (id) => {
    if (!confirm("Tem certeza que deseja finalizar este serviço? Isso não pode ser desfeito.")) return;

    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${id}/finish`, { method: 'PATCH' });
      
      if (response.ok) {
        setProjects(prevProjects => 
          prevProjects.map(p => p.id === id ? { ...p, status: 'CONCLUIDO' } : p)
        );
      } else {
        alert("Erro ao concluir. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Meus Projetos</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((service) => (
                <div 
                  key={service.id} 
                  onClick={() => setSelectedProject(service)}
                  className={`group border p-6 rounded-2xl backdrop-blur-sm transition flex flex-col h-full cursor-pointer hover:shadow-2xl relative overflow-hidden ${
                    service.status === 'CONCLUIDO' 
                      ? 'bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20' // Estilo especial para concluídos
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30'
                  }`}
                >
                  
                  {}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full border ${
                      service.status === 'CONCLUIDO' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {service.status}
                    </span>
                    <span className="text-white font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.budget)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{service.title}</h3>

                  {}
                  <div className="flex items-center gap-2 text-xs text-yellow-400 mb-4 bg-yellow-400/10 p-2 rounded-lg border border-yellow-400/20">
                    <MapPin size={16} className="shrink-0" />
                    <span className="font-medium truncate">
                      {service.address ? service.address : "Endereço não informado"}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">{service.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                      <Clock size={14} />
                      <span>Cliente: {service.client?.name || 'Desconhecido'}</span>
                    </div>

                    {}
                    {service.status === 'CONCLUIDO' ? (
                      <button 
                        disabled
                        className="w-full py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex justify-center items-center gap-2 cursor-default opacity-80"
                      >
                        <Trophy size={18} />
                        Serviço Finalizado
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleFinish(service.id);
                        }}
                        className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition flex justify-center items-center gap-2 shadow-lg hover:scale-[1.02]"
                      >
                        <CheckCircle size={18} />
                        Concluir Serviço
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 col-span-full text-center py-10 border border-white/10 rounded-2xl bg-white/5">
                Nenhum projeto em andamento. Vá ao Mural buscar oportunidades!
              </div>
            )}
          </div>
        )}

        <ServiceDetailsModal 
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          service={selectedProject}
          userType="LEITURA" 
        />

      </div>
    </DashboardLayout>
  );
}