import React from 'react';
import { X, MapPin, Calendar, DollarSign, User, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ServiceDetailsModal({ service, isOpen, onClose, userType, onAccept, onCounterOffer, onClientApprove, onClientReject }) {
  if (!isOpen || !service) return null;

  const isOwner = userType === 'client';
  
  const priceValue = Number(service.price) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="h-48 bg-[#0f1014] relative">
          {service.imageUrl ? (
            <img 
              src={`https://freehub-api.onrender.com${service.imageUrl}`} 
              alt={service.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              Sem imagem disponível
            </div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{service.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <span>Publicado em {new Date(service.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Valor do Serviço</p>
              <span className="text-2xl font-bold text-emerald-400">
                R$ {priceValue.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <User size={16} className="text-blue-400" />
              Sobre o Cliente
            </h3>
            <p className="text-gray-300 text-sm">
              {service.client?.name || 'Usuário do FreeHub'}
            </p>
            <p className="text-gray-500 text-xs mt-1">{service.client?.email}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-300 mb-2">Descrição</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                <MapPin size={16} /> Localização
              </h3>
              <p className="text-gray-400 text-sm">
                {service.description.includes('Rua') || service.description.includes('Av') 
                  ? 'Endereço detalhado na descrição.' 
                  : 'Localização a combinar com o cliente.'}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex gap-3 justify-end">
            {!isOwner && service.status === 'open' && (
              <>
                <button 
                  onClick={() => { onAccept(service.id); onClose(); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Aceitar Serviço
                </button>
                <button 
                  onClick={() => { onCounterOffer(service); onClose(); }}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2.5 rounded-xl font-bold transition"
                >
                  Negociar Valor
                </button>
              </>
            )}

            {isOwner && service.status === 'pending_approval' && (
              <>
                 <button 
                  onClick={() => { onClientApprove(service.id); onClose(); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition"
                >
                  Aprovar Proposta
                </button>
                <button 
                  onClick={() => { onClientReject(service.id); onClose(); }}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-xl font-bold transition"
                >
                  Recusar
                </button>
              </>
            )}
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-white px-4 py-2 transition text-sm"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}