// This is the main property evaluation page component
// It renders the chat interface on the left and the form on the right

import { useRef, useState } from "react";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full viewport background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center w-screen h-screen"
        style={{
          backgroundImage: "url('/uploads/background-image.webp')",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-2">
            <img 
              src="/uploads/auctoa-logo-creme.png" 
              alt="Auctoa" 
              className="h-8 w-auto"
            />
          </div>
          <Button 
            variant="outline" 
            className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
          >
            Gratis Expertengespräch anfragen
          </Button>
        </header>

        {/* Main content area - split layout */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left side - Chat interface */}
          <div className="w-1/2 flex flex-col p-4 min-w-0">
            {/* Chat messages area */}
            <div className="flex-1 mb-4 overflow-y-auto pr-2">
              {/* Welcome chat bubble */}
              <div className="flex justify-start mb-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md border border-gray-200 relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white/95 border-l border-b border-gray-200 transform rotate-45"></div>
                  <p className="text-gray-700 text-sm">
                    Hallo! Meine Schwester und ich haben in Nürnberg-Eibach 
                    eine Wohnung geerbt. Wir wissen weder, was sie wert ist 
                    noch, wie wir den Verkauf angehen.
                  </p>
                </div>
              </div>

              {/* Additional chat messages can be added here */}
            </div>

            {/* Chat input at bottom of left side */}
            <div className="flex-shrink-0">
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Schreibe deine Nachricht"
                    className="flex-1 bg-transparent text-white placeholder-gray-300 border-none outline-none text-sm"
                  />
                  <Button 
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-full"
                  >
                    →
                  </Button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white/70 hover:text-white text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📎 Dokumente hochladen
                  </Button>
                </div>
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    console.log("Files selected:", e.target.files);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>

          {/* Right side - Multi-step form (fixed) */}
          <div className="w-1/2 p-2 flex flex-col">
            <div className="h-full">
              <MultiStepForm />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-4">
          <div className="flex items-center justify-center gap-6 text-white/70 text-xs">
            <span>Antworten einer KI. Infos bitte prüfen.</span>
            <span>Datenschutz</span>
            <span>Impressum</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
