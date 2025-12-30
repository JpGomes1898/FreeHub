import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid, PlusCircle, User, Briefcase } from 'lucide-react';
import CreateServiceModal from './CreateServiceModal';

const BG_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleServiceCreated = () => {
    window.location.reload(); 
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden text-white">
      
      {}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-black/60 z-0 backdrop-blur-[4px]" />

      {}
      <aside className="relative z-10 w-64 bg-white/5 border-r border-white/10 flex-col justify-between hidden md:flex backdrop-blur-md">
        <div>
          <div className="p-8">
            <h1 className="text-2xl font-bold tracking-wider cursor-pointer" onClick={() => navigate('/dashboard')}>
              Free<span className="text-blue-400">Hub</span>
            </h1>
            <p className="text-xs text-gray-400 mt-2">Olá, {user.name?.split(' ')[0]}</p>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            
            {}
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
            >
              <LayoutGrid size={20} />
              Mural de Serviços
            </button>
            
            {}
            {user.userType === 'PRESTADOR' && (
              <button 
                onClick={() => navigate('/my-projects')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
              >
                <Briefcase size={20} />
                Meus Projetos
              </button>
            )}

            {}
            {user.userType === 'CLIENTE' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
              >
                <PlusCircle size={20} />
                Novo Pedido
              </button>
            )}

            {}
            <button 
              onClick={() => navigate('/profile')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
            >
              <User size={20} />
              Meu Perfil
            </button>

          </nav>
        </div>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-300 hover:bg-red-500/10 rounded-xl transition"
          >
            <LogOut size={20} />
            Sair da conta
          </button>
        </div>
      </aside>

      {}
      <main className="relative z-10 flex-1 overflow-y-auto h-screen p-4 md:p-10">
        
        {}
        <header className="flex md:hidden justify-between items-center mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
            <h1 className="text-xl font-bold">Free<span className="text-blue-400">Hub</span></h1>
            <button onClick={handleLogout}><LogOut size={20} className="text-red-300"/></button>
        </header>
        
        {children}
      </main>

      {}
      <CreateServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onServiceCreated={handleServiceCreated}
      />
    </div>
  );
}