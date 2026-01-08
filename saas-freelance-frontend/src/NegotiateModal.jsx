import React, { useState } from 'react';
import { X, DollarSign, Send } from 'lucide-react';

export default function NegotiateModal({ isOpen, onClose, onSubmit, serviceTitle, currentBudget }) {
  const [offer, setOffer] = useState('');

  if (!isOpen) return null;

  const budgetValue = Number(currentBudget) || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!offer) return;
    onSubmit(offer);
    setOffer('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#1e1e24] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-3">
            <DollarSign size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Fazer Contraproposta</h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-1">{serviceTitle}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6 text-center border border-white/5">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Valor Atual</p>
          <p className="text-2xl font-bold text-emerald-400">
            R$ {budgetValue.toFixed(2).replace('.', ',')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sua Oferta (R$)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
              <input 
                type="number" 
                step="0.01"
                required
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#0f1014] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-bold text-lg"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Send size={18} /> Enviar Proposta
          </button>
        </form>

      </div>
    </div>
  );
}