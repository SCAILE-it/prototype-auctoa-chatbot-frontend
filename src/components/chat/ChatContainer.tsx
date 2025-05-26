
import React, { useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useChatState } from '@/hooks/useChatState';
import MessageList, { Message } from './MessageList';
import ChatInput from './ChatInput';
import PillBar from './PillBar';
import FileBubble from './FileBubble';

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
    <div className="h-full flex flex-col bg-transparent">
      {/* Messages area - fills available space and is scrollable */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isTyping={isTyping} />
      </div>

      {/* Fixed bottom input area */}
      <div className="bg-transparent border-t border-transparent">
        <div className="max-w-4xl mx-auto px-2 md:px-4 pb-4">
          {pills.length > 0 && (
            <div className="mb-4">
              <PillBar pills={pills} onPillClick={handlePillClick} />
            </div>
          )}
          
          {/* Show uploaded files above the input */}
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <FileBubble
                  key={index}
                  fileName={file.name}
                  onRemove={() => handleFileRemove(index)}
                  isUserMessage={true}
                />
              ))}
            </div>
          )}
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isTyping}
            value={inputValue}
            onChange={setInputValue}
            onFileButtonClick={handleFileButtonClick}
            hasFiles={files.length > 0}
          />
          
          {/* Hidden file input */}
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) {
                const filesArray = Array.from(e.target.files);
                handleFilesAdded(filesArray);
                e.target.value = '';
              }
            }}
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
