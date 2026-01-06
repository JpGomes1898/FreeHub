import React from 'react';
import { User, CheckCircle, DollarSign, XCircle, MapPin } from 'lucide-react';

export default function ServiceCard({ service, userType, onAccept, onCounterOffer, onRefuse, onClientApprove, onClientReject, onClick }) {
  
  const formattedBudget = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.budget);

  const statusColors = {
    'ABERTO': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'ANALISE': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'EM_ANDAMENTO': 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:shadow-2xl transition duration-300 backdrop-blur-sm flex flex-col min-h-[380px] cursor-pointer hover:border-blue-500/30"
    >
      
      {userType === 'PRESTADOR' && (
        <button 
          onClick={(e) => handleActionClick(e, () => onRefuse(service.id))}
          className="absolute top-6 right-6 text-gray-500 hover:text-red-400 transition z-10 p-2 bg-black/20 rounded-full"
        >
          <XCircle size={24} />
        </button>
      )}

      {service.imageUrl && (
        <div className="w-full h-48 mb-4 rounded-xl overflow-hidden border border-white/10">
          <img 
            src={`https://freehub-api.onrender.com${service.imageUrl}`} 
            alt={service.title} 
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
      )}

      <div className="mb-4 pointer-events-none">
        <div className="flex justify-between items-start mb-4 pr-8">
          <span className={`px-4 py-1.5 text-xs uppercase font-bold rounded-full border tracking-wider ${statusColors[service.status] || statusColors['ABERTO']}`}>
            {service.status}
          </span>
        </div>
        <span className="text-white font-bold text-4xl tracking-tight block">
          {formattedBudget}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 pointer-events-none">
        <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2">
          {service.title}
        </h3>
        
        {service.address && (
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 w-full">
            <MapPin size={18} className="shrink-0" />
            <span className="truncate">{service.address}</span>
          </div>
        )}
        
        <p className="text-gray-300 text-lg leading-relaxed line-clamp-4 mt-2">
          {service.description}
        </p>
      </div>

      <div className="pt-6 border-t border-white/10 mt-6">
        <div className="flex flex-col gap-4">
          
          <div className="flex items-center gap-3 text-gray-400 text-sm pointer-events-none">
            <div className="p-2 bg-white/10 rounded-full shrink-0"><User size={16} /></div>
            <span className="capitalize font-medium truncate">
              {service.client?.name || 'Cliente'}
            </span>
          </div>
          
          <div className="flex gap-3 w-full" onClick={(e) => e.stopPropagation()}>
            {userType === 'PRESTADOR' && (
              <>
                <button 
                  onClick={() => onCounterOffer(service)} 
                  className="flex-1 py-3 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl transition border border-blue-500/30 flex justify-center items-center gap-2 font-bold text-sm"
                >
                  <DollarSign size={18} /> Negociar
                </button>
                <button 
                  onClick={() => onAccept(service.id)} 
                  className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-lg"
                >
                  <CheckCircle size={18} /> Aceitar
                </button>
              </>
            )}

            {userType === 'CLIENTE' && (
              <>
                {service.status === 'ANALISE' ? (
                  <div className="flex gap-3 w-full">
                    <button 
                      onClick={() => onClientReject(service.id)} 
                      className="flex-1 py-3 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-300 hover:text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2"
                    >
                      <XCircle size={18} /> Recusar
                    </button>
                    
                    <button 
                      onClick={() => onClientApprove(service.id)} 
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-lg"
                    >
                      <CheckCircle size={18} /> Aprovar
                    </button>
                  </div>
                ) : (
                  <button disabled className="w-full py-3 bg-white/5 text-gray-400 text-sm font-semibold rounded-xl cursor-default border border-white/10">
                    Clique para ver detalhes
                  </button>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}