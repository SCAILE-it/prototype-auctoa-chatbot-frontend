
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
        
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="container mx-auto flex flex-col flex-1 max-w-4xl p-4">
            <div className="bg-cover bg-center rounded-lg overflow-hidden relative h-[300px] md:h-[400px] mb-8"
                style={{ backgroundImage: "url('/lovable-uploads/57cae35f-8e6a-41e0-9dc4-82468fd59e9d.png')" }}>
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">Machen Sie es wie</span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm">+ 3922 andere!</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Lassen Sie Ihre Immobilie digital einschätzen</h1>
                <p className="max-w-2xl text-sm md:text-base">
                  Stellen Sie uns Fragen rund um Ihre Immobilie – z.B. zur Bewertung, Finanzierung oder Entwicklungspotenzial.
                  Je mehr Kontext Sie geben (z.B. durch Dokumente oder Details zur Lage und Ausstattung), desto gezielter können wir Sie unterstützen.
                </p>
              </div>
            </div>
            
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
