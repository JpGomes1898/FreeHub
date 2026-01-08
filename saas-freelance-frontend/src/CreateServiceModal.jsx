import React, { useState } from 'react';
import { X, Upload, DollarSign, Loader, MapPin } from 'lucide-react';

export default function CreateServiceModal({ isOpen, onClose, onServiceCreated }) {
  const [loading, setLoading] = useState(false);
  
  // Estados separados para o endereço
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    uf: ''
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Busca CEP automático
  const handleCepBlur = async () => {
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setAddress(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            uf: data.uf
          }));
        }
      } catch (error) {
        console.error("Erro CEP", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Monta o endereço completo numa string só para salvar no banco
      const fullLocation = `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.uf} (CEP: ${cep})`;

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('userId', user.id);
      data.append('location', fullLocation); // Envia o endereço
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch('https://freehub-api.onrender.com/services', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        alert('Serviço criado com sucesso!');
        onServiceCreated();
        onClose();
      } else {
        const errorText = await response.text();
        console.error("Erro backend:", errorText);
        alert('Erro ao criar serviço.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Novo Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Título do Pedido</label>
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Formatar Computador..."
              className="w-full bg-[#0f1014] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Foto (Opcional)</label>
              <label className="flex items-center gap-3 px-4 py-3 bg-[#0f1014] border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition group">
                <Upload size={20} className="text-blue-500 group-hover:text-blue-400" />
                <span className="text-sm text-gray-400 truncate">
                  {formData.image ? formData.image.name : 'Escolher arquivo'}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Orçamento Sugerido (R$)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0,00"
                  className="w-full bg-[#0f1014] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* ÁREA DE ENDEREÇO */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin size={16} className="text-blue-400"/> Endereço do Serviço
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
                <input 
                    placeholder="CEP" 
                    value={cep} 
                    onChange={(e) => setCep(e.target.value)} 
                    onBlur={handleCepBlur}
                    className="col-span-1 bg-[#0f1014] border border-white/10 rounded-lg p-2 text-white text-sm"
                />
                <input 
                    name="city"
                    placeholder="Cidade" 
                    value={address.city} 
                    onChange={handleAddressChange}
                    className="col-span-1 bg-[#0f1014] border border-white/10 rounded-lg p-2 text-white text-sm"
                />
                <input 
                    name="uf"
                    placeholder="UF" 
                    value={address.uf} 
                    onChange={handleAddressChange}
                    className="col-span-1 bg-[#0f1014] border border-white/10 rounded-lg p-2 text-white text-sm"
                />
            </div>
            <input 
                name="street"
                placeholder="Rua / Logradouro" 
                value={address.street} 
                onChange={handleAddressChange}
                className="w-full bg-[#0f1014] border border-white/10 rounded-lg p-2 text-white text-sm"
            />
            <div className="grid grid-cols-2 gap-4">
                <input 
                    name="number"
                    placeholder="Número" 
                    value={address.number} 
                    onChange={handleAddressChange}
                    className="bg-[#0f1014] border border-white/10 rounded-lg p-2 text-white text-sm"
                />
                <input 
                    name="neighborhood"
                    placeholder="Bairro" 
                    value={address.neighborhood} 
                    onChange={handleAddressChange}
                    className="bg-[#0f1014] border border-white/10 rounded-lg p-2 text-white text-sm"
                />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Descrição Detalhada</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o que você precisa..."
              className="w-full bg-[#0f1014] border border-white/10 rounded-xl p-3 text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" /> : 'Publicar Pedido'}
          </button>

        </form>
      </div>
    </div>
  );
}