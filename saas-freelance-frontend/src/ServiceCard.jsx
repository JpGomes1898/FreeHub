import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle, AlertTriangle, User, MessageCircle } from 'lucide-react';
import ChatModal from './ChatModal';
import ReviewModal from './ReviewModal';

export default function ServiceCard({ service, userType, onAccept, onCounterOffer, onRefuse, onClientApprove, onClientReject, onClick }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isOwner = userType === 'client'; 
  
  const handleChatClick = (e) => {
    e.stopPropagation();
    setIsChatOpen(true);
  };

  const handleReviewClick = (e) => {
    e.stopPropagation();
    setIsReviewOpen(true);
  };

  return (
    <>
      <div onClick={onClick} className="bg-[#18181b] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition cursor-pointer group flex flex-col h-full relative">
        
        <div className="h-48 w-full bg-[#0f1014] relative overflow-hidden">
          {service.imageUrl ? (
            <img src={`https://freehub-api.onrender.com${service.imageUrl}`} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
              Sem imagem
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-emerald-400 font-bold text-sm">R$ {service.price}</span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white line-clamp-1">{service.title}</h3>
          </div>

          <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{service.description}</p>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <MapPin size={14} />
            <span className="truncate max-w-[200px]">
               {service.description.includes('📍') ? 'Endereço no detalhe' : 'Local não informado'}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
              service.status === 'open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              service.status === 'pending_approval' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              service.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              'bg-gray-500/10 text-gray-400 border-gray-500/20'
            }`}>
              {service.status === 'open' && 'Em Aberto'}
              {service.status === 'pending_approval' && 'Aguardando Aprovação'}
              {service.status === 'accepted' && 'Em Andamento'}
              {service.status === 'finished' && 'Finalizado'}
            </div>

            {service.status !== 'finished' && service.status !== 'open' && (
              <button 
                onClick={handleChatClick}
                className="p-2 bg-white/5 hover:bg-blue-600 hover:text-white rounded-full text-gray-400 transition"
                title="Abrir Chat"
              >
                <MessageCircle size={18} />
              </button>
            )}
          </div>
          
          <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            {!isOwner && service.status === 'open' && (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onAccept(service.id)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-sm transition"
                >
                  Aceitar
                </button>
                <button 
                  onClick={onCounterOffer}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-lg text-sm transition border border-white/10"
                >
                  Negociar
                </button>
                <button 
                  onClick={() => onRefuse(service.id)}
                  className="col-span-2 text-xs text-gray-500 hover:text-red-400 transition mt-1"
                >
                  Não tenho interesse
                </button>
              </div>
            )}

            {isOwner && service.status === 'pending_approval' && (
              <div className="space-y-2">
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-center">
                  <p className="text-yellow-500 text-xs font-bold mb-1">NOVA PROPOSTA</p>
                  <p className="text-white font-bold text-lg">R$ {service.price}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onClientApprove(service.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-sm transition"
                  >
                    Aprovar
                  </button>
                  <button 
                    onClick={() => onClientReject(service.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white font-bold py-2 rounded-lg text-sm transition border border-red-900/30"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            )}

            {isOwner && service.status === 'finished' && !service.review && (
              <button 
                onClick={handleReviewClick}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/20 font-bold py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
              >
                Avaliar Prestador
              </button>
            )}
          </div>
        </div>
      </div>

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        serviceId={service.id}
        serviceTitle={service.title}
      />

      <ReviewModal 
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        serviceId={service.id}
        userId={service.client?.id} 
      />
    </>
  );
}