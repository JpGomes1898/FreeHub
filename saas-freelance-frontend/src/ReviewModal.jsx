import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

export default function ReviewModal({ isOpen, onClose, serviceId, userId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Selecione pelo menos 1 estrela.");
    
    setIsLoading(true);
    try {
      const response = await fetch('https://freehub-api.onrender.com/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, serviceId, userId })
      });

      if (response.ok) {
        alert("Avaliação enviada com sucesso!");
        onClose();
      } else {
        alert("Erro ao enviar avaliação.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1014] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white">Avaliar Serviço</h3>
          <p className="text-sm text-gray-400 mt-1">Como foi o trabalho?</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={32} 
                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} 
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Deixe um comentário (opcional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-[#18181b] border border-white/10 rounded-lg p-3 text-white text-sm mb-4 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Enviar Avaliação'}
        </button>

      </div>
    </div>
  );
}