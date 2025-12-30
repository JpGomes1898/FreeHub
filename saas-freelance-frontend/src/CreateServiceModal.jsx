import React, { useState } from 'react';
import { X, DollarSign, Type, FileText, MapPin, Search } from 'lucide-react';

export default function CreateServiceModal({ isOpen, onClose, onServiceCreated }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  if (!isOpen) return null;

  const handleBlurCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
        document.getElementById('numeroInput').focus();
      } else {
        alert("CEP não encontrado.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedAddress = `${street}, ${number} ${complement ? '- ' + complement : ''} - ${neighborhood}, ${city} - ${state}`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/services', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          budget,
          clientId: user.id,
          address: formattedAddress,
          latitude: null,
          longitude: null
        })
      });

      if (!response.ok) throw new Error('Erro ao criar serviço');

      alert('Serviço criado com sucesso!');
      onServiceCreated();
      onClose();
      
      setTitle(''); setDescription(''); setBudget('');
      setCep(''); setStreet(''); setNumber(''); setComplement(''); setNeighborhood(''); setCity(''); setState('');

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl text-white overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Novo Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Título</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input required type="text" placeholder="Ex: Consertar torneira" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <textarea required rows="2" placeholder="Detalhes do serviço..." className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                  value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            
             <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Orçamento (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input required type="number" placeholder="0,00" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-4"></div>

          {}
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-3">
            <MapPin size={16} /> Endereço do Serviço
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {}
            <div className="col-span-1 relative">
              <input required type="text" placeholder="CEP" maxLength={9}
                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={cep} 
                onChange={(e) => setCep(e.target.value)} 
                onBlur={handleBlurCep} 
              />
              {cepLoading && <div className="absolute right-3 top-3 animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />}
            </div>

             {}
             <div className="col-span-2 flex gap-2">
                <input disabled type="text" placeholder="Cidade" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-gray-400 cursor-not-allowed" value={city} />
                <input disabled type="text" placeholder="UF" className="w-20 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-gray-400 cursor-not-allowed" value={state} />
            </div>

            {}
            <div className="col-span-3">
              <input required type="text" placeholder="Rua / Avenida" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>

            {}
            <div className="col-span-1">
              <input id="numeroInput" required type="text" placeholder="Nº" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={number} onChange={(e) => setNumber(e.target.value)} />
            </div>

            {}
            <div className="col-span-2">
              <input type="text" placeholder="Complemento (Apto, Bloco...)" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={complement} onChange={(e) => setComplement(e.target.value)} />
            </div>

            {}
            <div className="col-span-3">
              <input required type="text" placeholder="Bairro" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-6 transition shadow-lg disabled:opacity-50">
            {loading ? 'Publicando...' : 'Publicar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}