import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';

export default function NegotiateModal({ isOpen, onClose, onSubmit, serviceTitle, currentBudget }) {
  const [offerValue, setOfferValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerValue) return;
    
    setLoading(true);
    await onSubmit(offerValue);
    setLoading(false);
    setOfferValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fundo escuro */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Janela */}
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Fazer Contraproposta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 bg-white/5 p-4 rounded-lg border border-white/10">
          <p className="text-sm text-gray-400 mb-1">Serviço:</p>
          <p className="font-semibold text-gray-200">{serviceTitle}</p>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">Valor Atual:</span>
            <span className="text-emerald-400 font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentBudget)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Sua Oferta (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input 
                autoFocus
                type="number" 
                placeholder="Ex: 120.00"
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-600 text-lg"
                value={offerValue}
                onChange={(e) => setOfferValue(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-2 transition shadow-lg disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Proposta'}
          </button>
        </form>
      </div>
    </div>
  );
}