
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
        <header className="p-4 md:p-4 px-2 md:px-4 flex justify-between items-center bg-transparent">
          <div className="flex items-center">
            <img src="/lovable-uploads/29679e81-d20a-4793-949b-17b9a85706e3.png" alt="Auctoa Logo" className="h-8 mr-2" />
            <span className="text-xl font-medium text-black">auctoa</span>
          </div>
          <Button 
            variant="secondary" 
            className="bg-[#FFDB84] hover:bg-[#FFDB84]/80 text-black"
          >
            Beratungsgespräch anfragen
          </Button>
        </header>
        
        {/* Main content - ChatGPT style layout */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden px-2 md:px-4">
            <ChatContainer 
              variant={getVariant()}
              apiUrl={'https://webhook.site/your-id-here'} 
            />
          </div>
        </main>
        
        {/* Footer - much smaller and less prominent */}
        <footer className="py-1 px-2 md:px-4 bg-transparent text-center">
          <div className="flex justify-center space-x-3">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">Datenschutz</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">Impressum</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
