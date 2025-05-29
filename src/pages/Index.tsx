import React, { useRef } from "react";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatContainer from "@/components/chat/ChatContainer";
import PillBar from "@/components/chat/PillBar";
import FileUploadBar from "@/components/chat/FileUploadBar";
import ChatInput from "@/components/chat/ChatInput";
import ChatFooter from "@/components/chat/ChatFooter";

import { useChatState } from "@/hooks/useChatState";

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
    apiUrl:
      "https://n8n.scaile.it/webhook/c8298f2e-aa44-40ae-bc0e-3ce4dd93d1f2",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Full viewport background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center w-screen h-screen"
        style={{
          backgroundImage: "url('/uploads/background-image.png')",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ChatHeader />

        {/* Main chat area */}
        <main
          className="flex flex-col overflow-hidden px-2 md:px-4"
          style={{
            paddingTop: "64px",
            paddingBottom: "290px",
            height: "100vh",
          }}
        >
          {/* Chat messages container */}
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
        <ChatFooter />
      </div>
    </div>
  );
};

export default Index;
