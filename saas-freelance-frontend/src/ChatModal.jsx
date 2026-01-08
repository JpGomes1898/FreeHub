import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';

export default function ChatModal({ isOpen, onClose, serviceId, serviceTitle }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && serviceId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, serviceId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`https://freehub-api.onrender.com/services/${serviceId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await fetch('https://freehub-api.onrender.com/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          serviceId,
          senderId: user.id
        })
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f1014] border border-white/10 w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#18181b] rounded-t-2xl">
          <div>
            <h3 className="text-white font-bold">Chat</h3>
            <p className="text-xs text-gray-400 truncate max-w-[200px]">{serviceTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0f1014]">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              Nenhuma mensagem ainda.<br/>Comece a conversa!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-[#1e1e24] text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    <p>{msg.content}</p>
                    <span className="text-[10px] opacity-50 block text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-[#18181b] border-t border-white/10 rounded-b-2xl flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-[#0f1014] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition">
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );
}