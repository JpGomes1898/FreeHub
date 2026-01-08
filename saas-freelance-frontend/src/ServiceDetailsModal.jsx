import React from 'react';
import { X, MapPin, Calendar, User, CheckCircle } from 'lucide-react';

export default function ServiceDetailsModal({ service, isOpen, onClose, userType, onAccept, onCounterOffer, onClientApprove, onClientReject }) {
  if (!isOpen || !service) return null;

  const isClient = userType === 'client';
  
  // CORREÇÃO 1: Trata o preço vindo como texto ou número
  const priceString = String(service.price || '0').replace(',', '.'); 
  const priceValue = parseFloat(priceString) || 0;

  // CORREÇÃO 2: Garante que o endereço seja exibido
  const locationText = service.location && service.location.length > 5 
    ? service.location 
    : 'Endereço não informado pelo cliente.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Imagem */}
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
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{service.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <span>Publicado em {new Date(service.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-right">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Orçamento</p>
              <span className="text-2xl font-bold text-emerald-400">
                R$ {priceValue.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Descrição do Serviço</h3>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                {service.description}
              </p>
            </div>

            {/* Localização e Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Localização
                </h3>
                <p className="text-gray-200 text-sm font-medium">
                  {locationText}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                  <User size={16} /> Sobre o Cliente
                </h3>
                <p className="text-white text-sm font-bold">
                  {service.client?.name || 'Usuário do FreeHub'}
                </p>
                <p className="text-gray-500 text-xs">{service.client?.email}</p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-8 mt-6 border-t border-white/10 flex gap-3 justify-end">
            
            {/* Se for Prestador e estiver Aberto */}
            {!isClient && service.status === 'open' && (
              <>
                <button 
                  onClick={() => { onAccept(service.id); onClose(); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Aceitar Orçamento
                </button>
                <button 
                  onClick={() => { onCounterOffer(service); onClose(); }}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-bold transition"
                >
                  Negociar Valor
                </button>
              </>
            )}

            {/* Se for Cliente e tiver Proposta Pendente */}
            {isClient && service.status === 'pending_approval' && (
              <>
                 <button 
                  onClick={() => { onClientApprove(service.id); onClose(); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition"
                >
                  Aprovar Nova Proposta
                </button>
                <button 
                  onClick={() => { onClientReject(service.id); onClose(); }}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition"
                >
                  Recusar
                </button>
              </>
            )}
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-white px-4 py-2 transition text-sm font-medium"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}