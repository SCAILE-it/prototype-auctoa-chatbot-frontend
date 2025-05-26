
import React, { useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useChatState } from '@/hooks/useChatState';
import MessageList, { Message } from './MessageList';
import ChatInput from './ChatInput';
import PillBar from './PillBar';
import FileUploadBar from './FileUploadBar';

type ChatContainerProps = {
  variant?: string;
  initialMessages?: Message[];
  onPillClick?: (pill: string) => void;
  apiUrl?: string;
};

const ChatContainer = ({ 
  variant = 'valuation',
  initialMessages = [], 
  onPillClick,
  apiUrl = 'https://webhook.site/your-id-here'
}: ChatContainerProps) => {
  const {
    messages,
    isTyping,
    files,
    pills,
    inputValue,
    setInputValue,
    sendMessage,
    handleFilesAdded,
    handleFileRemove
  } = useChatState({
    initialMessages,
    variant,
    apiUrl
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePillClick = (pillText: string) => {
    setInputValue(pillText);
    if (onPillClick) {
      onPillClick(pillText);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message, files);
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      {/* Messages area - fills available space and expands upward */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        <div className="overflow-y-auto flex-shrink-0">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
      </div>

      {/* Sticky bottom input area */}
      <div className="sticky bottom-0 bg-transparent pb-4">
        <div className="max-w-4xl mx-auto px-2 md:px-4">
          {pills.length > 0 && (
            <div className="mb-4">
              <PillBar pills={pills} onPillClick={handlePillClick} />
            </div>
          )}
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            value={inputValue}
            onChange={setInputValue}
            onFileButtonClick={handleFileButtonClick}
          />
          
          {/* File upload section below the input */}
          <div className="mt-2">
            <FileUploadBar 
              files={files}
              onFilesAdded={handleFilesAdded}
              onFileRemove={handleFileRemove}
              uploadInputRef={fileInputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
