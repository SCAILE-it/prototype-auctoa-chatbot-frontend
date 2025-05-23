
import React from 'react';
import ChatContainer from '@/components/chat/ChatContainer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const getSessionId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sessionId') || '';
  };

  const getVariant = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('variant') || 'valuation';
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full viewport background image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center w-screen h-screen" 
        style={{ backgroundImage: "url('/lovable-uploads/9fb56aab-0c40-494d-8fc7-f34f494795c2.png')" }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-4 flex justify-between items-center bg-transparent border-b">
          <div className="flex items-center">
            <img src="/lovable-uploads/logo-creme.png" alt="Auctoa Logo" className="h-8 mr-2" />
            <span className="text-xl font-medium text-black">auctoa</span>
          </div>
          <Button variant="secondary">Beratungsgespräch anfragen</Button>
        </header>
        
        {/* Main content - simplified */}
        <main className="flex-1 flex flex-col">
          <div className="container mx-auto flex flex-col flex-1 max-w-4xl p-4">
            <div className="bg-transparent rounded-lg flex-1 overflow-hidden flex flex-col">
              <ChatContainer 
                variant={getVariant()}
                apiUrl={'https://webhook.site/your-id-here'} 
              />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-4 bg-transparent border-t text-center text-sm text-black">
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:underline">Datenschutz</a>
            <a href="#" className="hover:underline">Impressum</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
