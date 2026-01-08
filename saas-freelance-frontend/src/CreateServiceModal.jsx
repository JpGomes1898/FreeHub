import React, { useState } from 'react';
import { X, Upload, DollarSign, Type, FileText, MapPin } from 'lucide-react';

export default function CreateServiceModal({ isOpen, onClose, onServiceCreated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
    // Novos campos de endereço (Visualmente igual ao vídeo)
    cep: '',
    city: '',
    uf: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: ''
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
      // TRUQUE: Juntamos o endereço na descrição para não perder os dados
      // já que o banco de dados ainda não tem colunas de endereço separadas.
      const fullAddress = `\n\n📍 Endereço do Serviço:\n${formData.street}, ${formData.number} - ${formData.neighborhood}\n${formData.city}/${formData.uf} - CEP: ${formData.cep}\n${formData.complement}`;
      
      const finalDescription = formData.description + fullAddress;

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', finalDescription); // Envia descrição + endereço
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
        onServiceCreated();
        onClose();
        // Limpa o formulário
        setFormData({ 
          title: '', description: '', price: '', image: null,
          cep: '', city: '', uf: '', street: '', number: '', complement: '', neighborhood: ''
        });
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Container com estilo escuro igual ao vídeo */}
      <div className="bg-[#0f1014] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Novo Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Formulário com Scroll */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Título */}
            <div className="space-y-1">
              <label className="text-gray-400 text-xs uppercase font-bold tracking-wider">Título</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  placeholder="Ex: Consertar torneira"
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-1">
              <label className="text-gray-400 text-xs uppercase font-bold tracking-wider">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <textarea
                  name="description"
                  value={formData.description}
                  rows="3"
                  placeholder="Detalhes do serviço..."
                  required
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-blue-600 outline-none resize-none placeholder-gray-600"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Grid: Foto e Orçamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-gray-400 text-xs uppercase font-bold tracking-wider">Foto do Problema (Opcional)</label>
                <div className="relative">
                  <div className="w-full bg-[#18181b] border border-white/10 rounded-lg py-2 px-2 flex items-center">
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded flex items-center gap-2 transition">
                      <Upload size={14} />
                      Escolher arquivo
                      <input type="file" name="image" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <span className="ml-3 text-xs text-gray-500 truncate">
                      {formData.image ? formData.image.name : 'Nenhum... escolhido'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 text-xs uppercase font-bold tracking-wider">Orçamento Sugerido (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    placeholder="0,00"
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO ENDEREÇO (Igual ao vídeo) */}
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-500/10 rounded-full">
                  <MapPin size={18} className="text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-sm">Endereço do Serviço</h3>
              </div>

              <div className="grid grid-cols-12 gap-3">
                {/* CEP */}
                <div className="col-span-4">
                  <input type="text" name="cep" placeholder="21521530" value={formData.cep} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600" />
                </div>
                {/* Cidade */}
                <div className="col-span-6">
                  <input type="text" name="city" placeholder="Rio de Janeiro" value={formData.city} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600" />
                </div>
                {/* UF */}
                <div className="col-span-2">
                  <input type="text" name="uf" placeholder="RJ" value={formData.uf} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600 text-center" />
                </div>

                {/* Rua */}
                <div className="col-span-12">
                  <input type="text" name="street" placeholder="Rua Botumirim" value={formData.street} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600" />
                </div>

                {/* Número */}
                <div className="col-span-4">
                  <input type="text" name="number" placeholder="Nº" value={formData.number} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600" />
                </div>
                {/* Complemento */}
                <div className="col-span-8">
                  <input type="text" name="complement" placeholder="Complemento" value={formData.complement} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600" />
                </div>

                 {/* Bairro */}
                 <div className="col-span-12">
                  <input type="text" name="neighborhood" placeholder="Bairro (ex: Pavuna)" value={formData.neighborhood} onChange={handleChange}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:ring-1 focus:ring-blue-600 outline-none placeholder-gray-600" />
                </div>
              </div>
            </div>

            {/* Botão de Enviar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Publicando...' : 'Publicar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}