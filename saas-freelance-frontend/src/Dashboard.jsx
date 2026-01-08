import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ServiceCard from './ServiceCard';
import NegotiateModal from './NegotiateModal';
import ServiceDetailsModal from './ServiceDetailsModal'; 
import { Search, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [hiddenServices, setHiddenServices] = useState([]); 
  
  const [isNegotiateModalOpen, setIsNegotiateModalOpen] = useState(false);
  const [selectedServiceForNegotiation, setSelectedServiceForNegotiation] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchServices();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('https://freehub-api.onrender.com/services');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setServices(data);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (serviceId) => {
    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${serviceId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: user.id })
      });
      if (response.ok) {
        showToast("Serviço aceito! Veja em 'Meus Projetos'.", "success");
        fetchServices();
      } else showToast("Erro ao aceitar.", "error");
    } catch (error) { showToast("Erro de conexão.", "error"); }
  };

  const openNegotiation = (service) => {
    setSelectedServiceForNegotiation(service);
    setIsNegotiateModalOpen(true);
  };

  const handleSubmitCounterOffer = async (newPrice) => {
    if (!selectedServiceForNegotiation) return;
    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${selectedServiceForNegotiation.id}/offer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: user.id, newPrice })
      });
      if (response.ok) {
        showToast(`Proposta enviada!`, "success");
        fetchServices();
      } else showToast("Erro ao enviar proposta.", "error");
    } catch (error) { showToast("Erro de conexão.", "error"); }
  };

  const handleRefuse = (serviceId) => {
    setHiddenServices([...hiddenServices, serviceId]);
    showToast("Serviço ocultado.", "success");
  };

  const handleClientApprove = async (serviceId) => {
    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${serviceId}/approve`, { method: 'PATCH' });
      if (response.ok) {
        showToast("Proposta aprovada!", "success");
        fetchServices();
      }
    } catch (e) { showToast("Erro ao aprovar.", "error"); }
  };

  const handleClientReject = async (serviceId) => {
    if(!confirm("Tem certeza?")) return;
    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${serviceId}/reject`, { method: 'PATCH' });
      if (response.ok) {
        showToast("Proposta recusada.", "success");
        fetchServices();
      }
    } catch (e) { showToast("Erro ao recusar.", "error"); }
  };

  const safeServices = Array.isArray(services) ? services : [];

  const filteredServices = safeServices.filter(service => 
    !hiddenServices.includes(service.id) && 
    (service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto relative">
        
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all ${notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {notification.type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
            <div><p className="font-bold text-sm">{notification.message}</p></div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Mural de Oportunidades</h2>
            <p className="text-gray-400 mt-2">Gerencie seus pedidos e propostas.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto items-center">
             <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Buscar serviços..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  userType={user.userType || user.role}
                  onAccept={handleAccept}
                  onCounterOffer={() => openNegotiation(service)}
                  onRefuse={handleRefuse}
                  onClientApprove={handleClientApprove}
                  onClientReject={handleClientReject}
                  onClick={() => setSelectedServiceDetails(service)} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                Nenhum serviço encontrado.
              </div>
            )}
          </div>
        )}

        <NegotiateModal 
          isOpen={isNegotiateModalOpen} 
          onClose={() => setIsNegotiateModalOpen(false)}
          onSubmit={handleSubmitCounterOffer} 
          serviceTitle={selectedServiceForNegotiation?.title} 
          currentBudget={selectedServiceForNegotiation?.price || selectedServiceForNegotiation?.budget}
        />

        <ServiceDetailsModal 
          isOpen={!!selectedServiceDetails}
          onClose={() => setSelectedServiceDetails(null)}
          service={selectedServiceDetails}
          userType={user.userType || user.role}
          onAccept={handleAccept}
          onCounterOffer={openNegotiation} 
          onClientApprove={handleClientApprove}
          onClientReject={handleClientReject}
       />

      </div>
    </DashboardLayout>
  );
}