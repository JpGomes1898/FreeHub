import React from 'react';
import { X, User, MapPin, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';

export default function ServiceDetailsModal({ isOpen, onClose, service, userType, onAccept, onCounterOffer, onRefuse, onClientApprove, onClientReject }) {
  if (!isOpen || !service) return null;

  const formattedBudget = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.budget);
  const date = new Date(service.createdAt).toLocaleDateString('pt-BR');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
          <div>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-wider">
              {service.status}
            </span>
            <h2 className="text-2xl font-bold text-white mt-3">{service.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {}
        <div className="p-8 overflow-y-auto space-y-8">
          
          {}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <p className="text-emerald-400 text-sm font-bold uppercase mb-1">Orçamento</p>
              <p className="text-3xl font-bold text-white">{formattedBudget}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex-1">
              <p className="text-gray-400 text-sm font-bold uppercase mb-1">Cliente</p>
              <div className="flex items-center gap-2 text-white font-medium">
                <User size={18} />
                {service.client?.name || 'Anônimo'}
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 border-l-4 border-blue-500 pl-3">Descrição do Serviço</h3>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                <MapPin size={18} /> Localização
              </div>
              <p className="text-gray-300 text-sm">{service.address || "Endereço não informado"}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                <Calendar size={18} /> Data do Pedido
              </div>
              <p className="text-gray-300 text-sm">Postado em {date}</p>
            </div>
          </div>

        </div>

        {}
        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 text-gray-400 hover:text-white font-medium transition">
              Fechar
            </button>

            {}
            {userType === 'PRESTADOR' && (
              <>
                <button 
                  onClick={() => { onCounterOffer(service); onClose(); }} 
                  className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl font-bold transition flex items-center gap-2 border border-blue-500/30"
                >
                  <DollarSign size={18} /> Negociar
                </button>
                <button 
                  onClick={() => { onAccept(service.id); onClose(); }} 
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle size={18} /> Aceitar Serviço
                </button>
              </>
            )}

            {}
            {userType === 'CLIENTE' && service.status === 'ANALISE' && (
               <>
                <button onClick={() => { onClientReject(service.id); onClose(); }} className="px-6 py-3 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl font-bold transition">Recusar</button>
                <button onClick={() => { onClientApprove(service.id); onClose(); }} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-lg">Aprovar</button>
               </>
            )}
        </div>

      </div>
    </div>
  );
}