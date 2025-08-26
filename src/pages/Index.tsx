// This is the main property evaluation page component
// It renders the chat interface on the left and the form on the right

import { useRef, useState } from "react";
import MultiStepForm from "@/components/forms/MultiStepForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Full viewport background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center w-screen h-screen"
        style={{
          backgroundImage: "url('/uploads/background-image.webp')",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img 
              src="/uploads/auctoa-logo-creme.png" 
              alt="Auctoa" 
              className="h-7 w-auto"
            />
          </div>
          <Button 
            variant="outline" 
            className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500 text-sm px-4 py-2"
          >
            Gratis Expertengespräch anfragen
          </Button>
        </header>

        {/* Main content area - split layout */}
        <main className="flex-1 flex overflow-hidden px-6 pb-3">
          {/* Left side - Chat interface */}
          <div className="flex flex-col pr-8" style={{ width: '42%', maxWidth: '580px' }}>
            {/* Chat messages area */}
            <div className="flex-1 mb-3 overflow-y-auto">
              {/* Welcome chat bubble */}
              <div className="flex justify-start mb-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md border border-gray-200 relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white/95 border-l border-b border-gray-200 transform rotate-45"></div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Hallo! Meine Schwester und ich haben in Nürnberg-Eibach 
                    eine Wohnung geerbt. Wir wissen weder, was sie wert ist 
                    noch, wie wir den Verkauf angehen.
                  </p>
                </div>
              </div>

              {/* Second chat bubble */}
              <div className="flex justify-start mb-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md border border-gray-200 relative">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white/95 border-l border-b border-gray-200 transform rotate-45"></div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Hallo Inga! Gerne helfe ich euch kostenlos. Lass uns mit 
                    ein paar Basisdaten starten – das dauert nur wenige 
                    Minuten.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat input at bottom of left side */}
            <div className="flex-shrink-0">
              <div className="rounded-2xl p-4 flex flex-col justify-between" style={{ background: '#FFFFFF33', backdropFilter: 'blur(10px)', width: '516px', height: '143px' }}>
                {/* Chat input field at top */}
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      console.log("Sending message:", inputValue);
                      setInputValue("");
                    }
                  }}
                  placeholder="Schreibe deine Nachricht"
                  className="bg-transparent text-white placeholder-white/70 border-none outline-none text-sm"
                />
                
                <div className="flex items-center justify-between gap-4">
                  <button 
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white hover:bg-white/30 text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      width: '209px',
                      height: '40px',
                      padding: '8px 16px'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                      <g clipPath="url(#clip0_150_10201)">
                        <path d="M10.8359 16.6673L16.6693 10.834" stroke="currentColor" strokeWidth="1.04167" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.8359 16.6673V11.6673C10.8359 11.4463 10.9237 11.2343 11.08 11.0781C11.2363 10.9218 11.4483 10.834 11.6693 10.834H16.6693V5.00065C16.6693 4.55862 16.4937 4.1347 16.1811 3.82214C15.8686 3.50958 15.4446 3.33398 15.0026 3.33398H5.0026C4.56058 3.33398 4.13665 3.50958 3.82409 3.82214C3.51153 4.1347 3.33594 4.55862 3.33594 5.00065V15.0006C3.33594 15.4427 3.51153 15.8666 3.82409 16.1792C4.13665 16.4917 4.56058 16.6673 5.0026 16.6673H10.8359Z" stroke="currentColor" strokeWidth="1.04167" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_150_10201">
                          <rect width="20" height="20" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    Dokumente hochladen
                  </button>
                              <button 
                className="flex-shrink-0"
                onClick={() => {
                  if (inputValue.trim()) {
                    console.log("Sending message:", inputValue);
                    setInputValue("");
                  }
                }}
              >
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <foreignObject x="-4" y="-4" width="68" height="48"><div xmlns="http://www.w3.org/1999/xhtml" style={{backdropFilter:'blur(2px)', clipPath:'url(#bgblur_0_241_585_clip_path)', height:'100%', width:'100%'}}></div></foreignObject>
                <g data-figma-bg-blur-radius="4">
                  <rect width="60" height="40" rx="10" fill="#FAF4E6"/>
                  <path d="M24 25.3327V14.666L36.6667 19.9993L24 25.3327ZM25.3333 23.3327L33.2333 19.9993L25.3333 16.666V18.9993L29.3333 19.9993L25.3333 20.9993V23.3327ZM25.3333 23.3327V19.9993V16.666V18.9993V20.9993V23.3327Z" fill="#B3B0A6"/>
                </g>
                <defs>
                  <clipPath id="bgblur_0_241_585_clip_path" transform="translate(4 4)">
                    <rect width="60" height="40" rx="10"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
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

          {/* Right side - Multi-step form */}
          <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto">
            <MultiStepForm />
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-2 flex-shrink-0">
          <div className="flex items-center justify-center gap-4 text-white/70 text-xs">
            <span>Datenschutz</span>
            <span>Impressum</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
