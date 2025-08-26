// This is the main property evaluation page component
// It renders the chat interface on the left and the form on the right

import { useRef, useState } from "react";
import MultiStepForm from "@/components/forms/MultiStepForm";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true
    };
    
    const botResponse: Message = {
      id: Date.now() + 1,
      text: "Hallo Inga! Gerne helfe ich euch kostenlos. Lass uns mit ein paar Basisdaten starten – das dauert nur wenige Minuten.",
      isUser: false
    };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue("");
  };

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
        {/* Auctoa logo - top left corner */}
        <div className="absolute top-4 left-6 z-20">
          <svg width="126" height="21" viewBox="0 0 84 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
            <g clipPath="url(#clip0_429_13633)">
              <path d="M13.3325 10.2157C13.3325 10.6799 13.3871 11.0076 13.4963 11.1987C13.6055 11.3899 13.824 11.5264 14.1517 11.6083L14.0698 13.5334C13.6329 13.6017 13.2506 13.6495 12.9229 13.6768C12.6089 13.7041 12.1856 13.7178 11.6531 13.7178C10.4789 13.7178 9.7007 13.4583 9.3184 12.9395C8.93611 12.407 8.74496 11.7312 8.74496 10.912V10.4C8.34901 11.5196 7.76875 12.3524 7.00416 12.8986C6.25323 13.4447 5.29067 13.7178 4.11648 13.7178C2.75115 13.7178 1.72032 13.4447 1.024 12.8986C0.341333 12.3524 0 11.5401 0 10.4614C0 9.57401 0.293547 8.87769 0.88064 8.37252C1.46773 7.86734 2.37568 7.51918 3.60448 7.32804C2.56683 6.59076 1.52917 5.94905 0.49152 5.40292C1.31072 4.36526 2.24597 3.5802 3.29728 3.04772C4.34859 2.50158 5.62517 2.22852 7.12704 2.22852C9.22965 2.22852 10.7861 2.6859 11.7965 3.60068C12.8205 4.5018 13.3325 5.89444 13.3325 7.7786V10.2157ZM7.55712 5.833C6.8608 5.833 6.2464 5.94905 5.71392 6.18116C5.18144 6.41326 4.70357 6.76142 4.28032 7.22564C5.09952 7.13006 6.12352 7.08228 7.35232 7.08228C7.85749 7.08228 8.21248 7.02084 8.41728 6.89796C8.62208 6.77508 8.72448 6.61806 8.72448 6.42692C8.72448 6.26308 8.62208 6.12654 8.41728 6.01732C8.21248 5.89444 7.92576 5.833 7.55712 5.833ZM5.40672 10.3795C6.17131 10.3795 6.8608 10.2362 7.4752 9.94948C8.0896 9.6491 8.51285 9.25998 8.74496 8.78212V8.24964C8.41728 8.41348 8.05547 8.54318 7.65952 8.63876C7.26357 8.72068 6.78571 8.8026 6.22592 8.88452L5.48864 9.0074C4.72405 9.15758 4.34176 9.417 4.34176 9.78564C4.34176 10.1815 4.69675 10.3795 5.40672 10.3795Z" fill="white" fillOpacity="0.5"/>
              <path d="M27.9819 2.43359C27.8863 4.15391 27.8385 6.01076 27.8385 8.00415C27.8385 10.0112 27.8863 11.8817 27.9819 13.6157C27.1081 13.5747 26.4186 13.5542 25.9134 13.5542C25.4356 13.5542 24.7461 13.5747 23.8449 13.6157L23.251 10.6051C22.937 11.6974 22.4455 12.5097 21.7765 13.0422C21.1074 13.561 20.3292 13.8205 19.4417 13.8205C18.6225 13.8205 17.9126 13.643 17.3118 13.288C16.7111 12.9193 16.2537 12.4278 15.9397 11.8134C15.6393 11.199 15.4891 10.5095 15.4891 9.74495V6.79583C15.4891 4.97993 15.455 3.52585 15.3867 2.43359H19.9947C19.9128 4.44063 19.8718 6.42719 19.8718 8.39327C19.8718 8.99401 20.0152 9.47188 20.3019 9.82687C20.6023 10.1818 20.9777 10.3593 21.4283 10.3593C21.8516 10.3593 22.2202 10.175 22.5342 9.80639C22.8619 9.42409 23.0599 8.90527 23.1281 8.24991V7.77887C23.1554 6.71391 23.1691 5.97663 23.1691 5.56703C23.1691 4.62495 23.1418 3.58047 23.0872 2.43359H27.9819Z" fill="white" fillOpacity="0.5"/>
              <path d="M33.7841 8.02436C33.8114 8.72068 34.0299 9.28046 34.4395 9.70372C34.8628 10.1269 35.484 10.3386 36.3032 10.3386C36.7537 10.3386 37.1565 10.2566 37.5115 10.0928C37.8665 9.91534 38.1942 9.65593 38.4945 9.3146C39.6551 9.76516 41.0136 10.1542 42.5701 10.4819C42.1195 11.5332 41.3549 12.3524 40.2763 12.9395C39.2113 13.5266 37.8255 13.8202 36.1189 13.8202C33.8388 13.8202 32.1526 13.2877 31.0603 12.2227C29.968 11.1578 29.4219 9.75833 29.4219 8.02436C29.4219 6.29038 29.968 4.89092 31.0603 3.82596C32.1526 2.761 33.8388 2.22852 36.1189 2.22852C37.8255 2.22852 39.2113 2.52206 40.2763 3.10916C41.3549 3.69625 42.1195 4.51545 42.5701 5.56676C41.3549 5.82617 39.9964 6.21529 38.4945 6.73412C38.1942 6.39278 37.8665 6.1402 37.5115 5.97636C37.1565 5.79886 36.7537 5.71012 36.3032 5.71012C35.484 5.71012 34.8628 5.92174 34.4395 6.345C34.0299 6.76825 33.8114 7.32804 33.7841 8.02436Z" fill="white" fillOpacity="0.5"/>
              <path d="M53.384 6.09841C52.1279 6.01649 50.9811 5.95505 49.9434 5.91409L49.9229 8.08497C49.9229 8.82225 50.0799 9.40251 50.394 9.82577C50.7216 10.2354 51.2951 10.4402 52.1143 10.4402C52.4283 10.4402 52.7287 10.4129 53.0154 10.3582C52.9608 10.8634 52.9335 11.3754 52.9335 11.8942C52.9335 12.14 52.9471 12.6998 52.9744 13.5736C52.3737 13.6828 51.8685 13.7511 51.4589 13.7784C51.0493 13.8057 50.5168 13.8194 49.8615 13.8194C48.264 13.8194 47.1308 13.4371 46.4618 12.6725C45.8064 11.8942 45.4788 10.8156 45.4788 9.43665L45.4992 5.97553C44.8575 6.00283 44.1885 6.04379 43.4922 6.09841V2.47345C44.2022 2.47345 44.8029 2.24817 45.2944 1.79761C45.786 1.34705 46.0795 0.807741 46.1751 0.179688H51.7456C51.0493 1.13542 50.2779 1.90001 49.4314 2.47345H53.384V6.09841Z" fill="white" fillOpacity="0.5"/>
              <path d="M61.1978 13.8202C58.863 13.8202 57.1427 13.2877 56.0368 12.2227C54.9445 11.1441 54.3984 9.73102 54.3984 7.9834C54.3984 6.27673 54.9445 4.89092 56.0368 3.82596C57.1427 2.761 58.863 2.22852 61.1978 2.22852C62.7679 2.22852 64.0786 2.48793 65.1299 3.00676C66.1949 3.51193 66.98 4.20142 67.4851 5.07524C67.9903 5.9354 68.2429 6.90478 68.2429 7.9834C68.2429 9.74468 67.6558 11.1578 66.4816 12.2227C65.3211 13.2877 63.5598 13.8202 61.1978 13.8202ZM61.2797 10.3386C62.1672 10.3386 62.8293 10.1269 63.2662 9.70372C63.7032 9.28046 63.9216 8.71385 63.9216 8.00388C63.9216 7.33486 63.7032 6.78873 63.2662 6.36548C62.8293 5.92857 62.1672 5.71012 61.2797 5.71012C60.3922 5.71012 59.7437 5.92174 59.3341 6.345C58.9245 6.76825 58.7197 7.32121 58.7197 8.00388C58.7197 8.71385 58.9245 9.28046 59.3341 9.70372C59.7437 10.1269 60.3922 10.3386 61.2797 10.3386Z" fill="white" fillOpacity="0.5"/>
              <path d="M82.813 10.2157C82.813 10.6799 82.8676 11.0076 82.9768 11.1987C83.0861 11.3899 83.3045 11.5264 83.6322 11.6083L83.5503 13.5334C83.1134 13.6017 82.7311 13.6495 82.4034 13.6768C82.0894 13.7041 81.6661 13.7178 81.1336 13.7178C79.9594 13.7178 79.1812 13.4583 78.7989 12.9395C78.4166 12.407 78.2255 11.7312 78.2255 10.912V10.4C77.8295 11.5196 77.2492 12.3524 76.4847 12.8986C75.7337 13.4447 74.7712 13.7178 73.597 13.7178C72.2316 13.7178 71.2008 13.4447 70.5045 12.8986C69.8218 12.3524 69.4805 11.5401 69.4805 10.4614C69.4805 9.57401 69.774 8.87769 70.3611 8.37252C70.9482 7.86734 71.8562 7.51918 73.085 7.32804C72.0473 6.59076 71.0097 5.94905 69.972 5.40292C70.7912 4.36526 71.7265 3.5802 72.7778 3.04772C73.8291 2.50158 75.1057 2.22852 76.6075 2.22852C78.7102 2.22852 80.2666 2.6859 81.277 3.60068C82.301 4.5018 82.813 5.89444 82.813 7.7786V10.2157ZM77.0376 5.833C76.3413 5.833 75.7269 5.94905 75.1944 6.18116C74.6619 6.41326 74.1841 6.76142 73.7608 7.22564C74.58 7.13006 75.604 7.08228 76.8328 7.08228C77.338 7.08228 77.693 7.02084 77.8978 6.89796C78.1026 6.77508 78.205 6.61806 78.205 6.42692C78.205 6.26308 78.1026 6.12654 77.8978 6.01732C77.693 5.89444 77.4063 5.833 77.0376 5.833ZM74.8872 10.3795C75.6518 10.3795 76.3413 10.2362 76.9557 9.94948C77.5701 9.6491 77.9934 9.25998 78.2255 8.78212V8.24964C77.8978 8.41348 77.536 8.54318 77.14 8.63876C76.7441 8.72068 76.2662 8.8026 75.7064 8.88452L74.9691 9.0074C74.2046 9.15758 73.8223 9.417 73.8223 9.78564C73.8223 10.1815 74.1773 10.3795 74.8872 10.3795Z" fill="white" fillOpacity="0.5"/>
            </g>
            <defs>
              <clipPath id="clip0_429_13633">
                <rect width="84" height="14" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Main content area - split layout */}
        <main className="flex-1 flex overflow-hidden pl-4 pr-8 pt-1 pb-3">
          {/* Left side - Chat interface */}
          <div className="flex flex-col pr-8" style={{ width: '42%', maxWidth: '580px' }}>
            {/* Chat messages area */}
            <div className="flex-1 mb-3 overflow-y-auto flex flex-col justify-end" style={{ width: '580px' }}>
              {messages.length > 0 && (
                <div className="flex flex-col gap-3">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-md border border-gray-200 relative">
                        {!message.isUser && (
                          <div className="absolute -left-2 top-4 w-4 h-4 bg-white/95 border-l border-b border-gray-200 transform rotate-45"></div>
                        )}
                        {message.isUser && (
                          <div className="absolute -right-2 top-4 w-4 h-4 bg-white/95 border-r border-b border-gray-200 transform -rotate-45"></div>
                        )}
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat input at bottom of left side */}
            <div className="flex-shrink-0">
              <div className="rounded-2xl p-4 flex flex-col justify-between" style={{ background: '#FFFFFF33', backdropFilter: 'blur(10px)', width: '580px', height: '143px' }}>
                {/* Chat input field at top */}
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
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
                    onClick={sendMessage}
                  >
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <foreignObject x="-4" y="-4" width="68" height="48"><div style={{backdropFilter:'blur(2px)', clipPath:'url(#bgblur_0_241_585_clip_path)', height:'100%', width:'100%'}}></div></foreignObject>
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

            {/* Footer - moved to left side under chat */}
            <footer className="mt-4 flex-shrink-0">
              <div className="flex items-center justify-center gap-4 text-white/70 text-xs">
                <span>Datenschutz</span>
                <span>Impressum</span>
              </div>
            </footer>
          </div>

          {/* Right side - Multi-step form */}
          <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto">
            <MultiStepForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
