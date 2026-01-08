import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutGrid, PlusCircle, User, Briefcase, Repeat } from 'lucide-react';
import CreateServiceModal from './CreateServiceModal';
import ProfileModal from './ProfileModal';

const BG_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  
  let user = {};
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      user = JSON.parse(storedUser);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  } catch (error) {
    console.error("Erro crítico ao ler usuário:", error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
  const isSuperUser = user.role === 'provider' || user.userType === 'provider' || user.userType === 'PRESTADOR';

  const initialMode = isSuperUser ? 'provider' : 'client';
  const [activeMode, setActiveMode] = useState(initialMode);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isClientView = activeMode === 'client';
  const isProviderView = activeMode === 'provider';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleMode = () => {
    const newMode = activeMode === 'client' ? 'provider' : 'client';
    setActiveMode(newMode);
    if (newMode === 'provider') {
        navigate('/my-projects');
    } else {
        navigate('/dashboard');
    }
  };

  const handleServiceCreated = () => {
    window.location.reload(); 
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden text-white">
      
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-black/60 z-0 backdrop-blur-[4px]" />

      <aside className="relative z-10 w-64 bg-white/5 border-r border-white/10 flex-col justify-between hidden md:flex backdrop-blur-md">
        <div>
          <div className="p-8">
            <h1 className="text-2xl font-bold tracking-wider cursor-pointer" onClick={() => navigate('/dashboard')}>
              Free<span className="text-blue-400">Hub</span>
            </h1>
            <div className="flex flex-col mt-2">
                <p className="text-xs text-gray-400">Olá, {user.name?.split(' ')[0] || 'Visitante'}</p>
                {isSuperUser && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 w-fit px-2 py-0.5 rounded ${
                      isProviderView ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                      Modo {isProviderView ? 'Prestador' : 'Cliente'}
                  </span>
                )}
            </div>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            
            {isSuperUser && (
              <button 
                onClick={toggleMode}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white transition text-left mb-6 group"
              >
                <div className="p-1.5 bg-white/10 rounded-full group-hover:rotate-180 transition duration-500">
                  <Repeat size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Trocar para</span>
                  <span className="text-sm font-bold">
                      {isClientView ? 'Prestador' : 'Cliente'}
                  </span>
                </div>
              </button>
            )}

            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
            >
              <LayoutGrid size={20} />
              Mural de Serviços
            </button>
            
            {isProviderView && (
              <button 
                onClick={() => navigate('/my-projects')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
              >
                <Briefcase size={20} />
                Meus Projetos
              </button>
            )}

            {isClientView && (
              <button 
                onClick={() => setIsServiceModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-xl text-gray-300 transition text-left"
              >
                <PlusCircle size={20} />
                Novo Pedido
              </button>
            )}

            <button 
              onClick={() => setIsProfileModalOpen(true)} 
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

      <main className="relative z-10 flex-1 overflow-y-auto h-screen p-4 md:p-10">
        <header className="flex md:hidden justify-between items-center mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
            <h1 className="text-xl font-bold">Free<span className="text-blue-400">Hub</span></h1>
            <div className="flex items-center gap-3">
                {isSuperUser && (
                  <button onClick={toggleMode} className="p-2 bg-white/10 rounded-full text-white">
                      <Repeat size={18} />
                  </button>
                )}
                {isClientView && (
                   <button onClick={() => setIsServiceModalOpen(true)}><PlusCircle size={20} className="text-blue-400"/></button>
                )}
                <button onClick={handleLogout}><LogOut size={20} className="text-red-300"/></button>
            </div>
        </header>
        
        {children}
      </main>

      <CreateServiceModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        onServiceCreated={handleServiceCreated}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

    </div>
  );
}