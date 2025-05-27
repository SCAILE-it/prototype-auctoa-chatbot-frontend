import React, { useRef } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import ChatInput from "@/components/chat/ChatInput";
import PillBar from "@/components/chat/PillBar";
import { Button } from "@/components/ui/button";
import { useChatState } from "@/hooks/useChatState";
import FileUploadBar from "@/components/chat/FileUploadBar";

const Index = () => {
  const getSessionId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("sessionId") || "";
  };

  const getVariant = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("variant") || "valuation";
  };

  const {
    messages,
    isTyping,
    files,
    pills,
    inputValue,
    setInputValue,
    sendMessage,
    handleFilesAdded,
    handleFileRemove,
    clearFiles,
  } = useChatState({
    variant: getVariant(),
    apiUrl: "https://webhook.site/your-id-here",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full viewport background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center w-screen h-screen"
        style={{
          backgroundImage: "url('/uploads/background.png')",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-20 p-4 md:p-4 px-2 md:px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/uploads/logo-transparent.png"
              alt="Auctoa Logo"
              className="h-4"
            />
          </div>
          <Button variant="default">Gratis Expertengespräch anfragen</Button>
        </header>

        {/* Main chat area */}
        <main
          className="flex flex-col overflow-hidden px-2 md:px-4"
          style={{
            paddingTop: "64px",
            paddingBottom: "270px",
            height: "100vh",
          }}
        >
          <div className="flex-1 overflow-hidden">
            <ChatContainer
              messages={messages}
              isTyping={isTyping}
              files={files}
            />
          </div>
        </main>

        {/* Chat input + pills (fixed) */}
        <div className="fixed bottom-8 left-0 right-0 z-20 px-4">
          <div className="max-w-4xl mx-auto">
            {pills.length > 0 && (
              <div className="mb-4">
                <PillBar pills={pills} onPillClick={setInputValue} />
              </div>
            )}
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSendMessage={(message) => {
                sendMessage(message, files);
                clearFiles();
              }}
              onFileButtonClick={() => fileInputRef.current?.click()}
              hasFiles={files.length > 0}
              disabled={isTyping}
              fileBubbles={
                <FileUploadBar
                  files={files}
                  onFilesAdded={handleFilesAdded}
                  onFileRemove={handleFileRemove}
                  uploadInputRef={fileInputRef}
                />
              }
            />
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleFilesAdded(Array.from(e.target.files));
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-10 py-1 px-2 md:px-4 bg-transparent text-center">
          <div className="flex justify-center space-x-3">
            <a
              href="#"
              className="text-xs text-[color:var(--neutral-grey)] hover:text-[color:var(--primary-creme)]"
            >
              Datenschutz
            </a>
            <a
              href="#"
              className="text-xs text-[color:var(--neutral-grey)] hover:text-[color:var(--primary-creme)]"
            >
              Impressum
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
