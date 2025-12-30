import React from 'react';

const BG_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      {}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {}
      <div className="absolute inset-0 bg-black/50 z-0 backdrop-blur-[2px]" />

      {}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-md text-white m-4">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-gray-200 mt-2 text-sm">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}