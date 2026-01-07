import React, { useState } from 'react';
import { X, Upload, DollarSign, Type, FileText } from 'lucide-react';

export default function CreateServiceModal({ isOpen, onClose, onServiceCreated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('userId', user.id);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch('https://freehub-api.onrender.com/services', {
        method: 'POST',
        body: data, 
      });

      if (response.ok) {
        onServiceCreated(); // Atualiza a lista no fundo
        onClose(); // Fecha a janela
        setFormData({ title: '', description: '', price: '', image: null }); // Limpa o form
      } else {
        alert('Erro ao criar o serviço.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e1e24] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Novo Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">Título</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  placeholder="Ex: Consertar torneira"
                  required
                  className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Foto do Problema (Opcional)</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-gray-400 text-sm cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Orçamento Sugerido (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    placeholder="0,00"
                    required
                    className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <textarea
                  name="description"
                  value={formData.description}
                  rows="4"
                  placeholder="Detalhes do serviço..."
                  required
                  className="w-full bg-[#111116] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Publicando...' : 'Publicar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}