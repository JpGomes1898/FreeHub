import React from 'react';
import { X, User, Mail, ShieldCheck, Briefcase } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Lógica correta para exibir o tipo
  const isProvider = user.userType === 'provider' || user.userType === 'PRESTADOR' || user.role === 'provider';
  const userLabel = isProvider ? 'PRESTADOR DE SERVIÇO' : 'CLIENTE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Cabeçalho colorido */}
        <div className={`h-24 ${isProvider ? 'bg-emerald-900/40' : 'bg-blue-900/40'} relative`}>
             <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition"
            >
              <X size={18} />
            </button>
        </div>

        <div className="px-6 pb-6 -mt-12 text-center">
            {/* Avatar */}
            <div className={`w-24 h-24 mx-auto rounded-full border-4 border-[#18181b] flex items-center justify-center text-3xl font-bold text-white shadow-lg ${isProvider ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {user.name?.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="mt-3 text-xl font-bold text-white">{user.name}</h2>
            
            {/* Badge do Tipo de Conta */}
            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                isProvider 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
                {isProvider ? <Briefcase size={12}/> : <User size={12}/>}
                {userLabel}
            </div>

            <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/5 space-y-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                        <Mail size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">E-mail</p>
                        <p className="text-sm text-gray-200 truncate max-w-[200px]">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                        <ShieldCheck size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Status da Conta</p>
                        <p className="text-sm text-emerald-400 font-medium">Ativa e Verificada</p>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}