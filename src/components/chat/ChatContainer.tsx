
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { useChatState } from '@/hooks/useChatState';
import MessageList, { Message } from './MessageList';
import ChatInput from './ChatInput';
import PillBar from './PillBar';
import FileUploadBar from './FileUploadBar';
import ChatActionBar from './ChatActionBar';

type CTAButton = {
  text: string;
  action: string;
};

type ChatContainerProps = {
  variant?: string;
  initialMessages?: Message[];
  onPillClick?: (pill: string) => void;
  onCtaClick?: (action: string) => void;
  apiUrl?: string;
};

const ChatContainer = ({ 
  variant = 'valuation',
  initialMessages = [], 
  onPillClick,
  onCtaClick,
  apiUrl = 'https://webhook.site/your-id-here'
}: ChatContainerProps) => {
  const {
    messages,
    isTyping,
    files,
    pills,
    inputValue,
    setInputValue,
    cta,
    sendMessage,
    handleFilesAdded,
    handleFileRemove
  } = useChatState({
    initialMessages,
    variant,
    apiUrl
  });

  const handlePillClick = (pillText: string) => {
    setInputValue(pillText);
    if (onPillClick) {
      onPillClick(pillText);
    }
  };

  const handleCtaClick = (action: string) => {
    if (onCtaClick) {
      onCtaClick(action);
    } else {
      // Default CTA behavior
      toast({
        title: "Action clicked",
        description: `Action: ${action}`,
      });
    }
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message, files);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <PillBar pills={pills} onPillClick={handlePillClick} />
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
      </div>

      <div className="p-4 border-t bg-background sticky bottom-0">
        <ChatActionBar cta={cta} onCtaClick={handleCtaClick} />
        <FileUploadBar 
          files={files}
          onFilesAdded={handleFilesAdded}
          onFileRemove={handleFileRemove}
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          value={inputValue}
          onChange={setInputValue}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
