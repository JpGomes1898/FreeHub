import React from 'react';
import { X, User, Mail, Shield, CheckCircle } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isClient = user.userType === 'client';
  const roleLabel = isClient ? 'Cliente' : 'Prestador de Serviço';
  const roleColor = isClient ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
  const gradient = isClient ? 'from-blue-600 to-cyan-600' : 'from-emerald-600 to-teal-600';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1014] border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden">
        
        <div className={`absolute top-0 w-full h-32 bg-gradient-to-r ${gradient} opacity-20`} />
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition backdrop-blur-md"
        >
          <X size={20} />
        </button>

        <div className="pt-16 pb-8 px-8 relative flex flex-col items-center text-center">
          
          <div className={`h-28 w-28 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-5xl font-bold text-white shadow-2xl border-4 border-[#0f1014] mb-4`}>
            {user.name?.charAt(0)}
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
          
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${roleColor} mb-6`}>
            <Shield size={12} />
            {roleLabel}
          </div>

          <div className="w-full bg-[#18181b] rounded-2xl border border-white/5 p-4 space-y-4 text-left">
            
            <div className="flex items-center gap-4 p-2">
              <div className="p-2.5 bg-white/5 rounded-lg text-gray-400">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">E-mail</p>
                <p className="text-white text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-2 border-t border-white/5 pt-4">
               <div className="p-2.5 bg-white/5 rounded-lg text-gray-400">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Status da Conta</p>
                <p className="text-emerald-400 text-sm flex items-center gap-1">
                  Ativa e Verificada
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}