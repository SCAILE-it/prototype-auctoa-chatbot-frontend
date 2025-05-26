
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFileButtonClick?: () => void;
};

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Tippen Sie hier...", 
  value = "",
  onChange,
  onFileButtonClick
}: ChatInputProps) => {
  const [message, setMessage] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Update internal state when external value changes
  useEffect(() => {
    setMessage(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !disabled) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Main input area */}
      <div className="relative flex items-end border rounded-lg bg-background overflow-hidden">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-[150px] w-full resize-none px-4 py-2 pr-12 focus:outline-none bg-transparent"
          rows={1}
        />
        
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || disabled}
          size="icon"
          variant="ghost"
          className="absolute right-1 bottom-1 rounded-full bg-[#FFDB84] hover:bg-[#FFDB84]/80 text-black"
        >
          <Send size={18} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      
      {/* File upload button below input */}
      <div className="flex justify-center">
        <Button 
          onClick={onFileButtonClick}
          size="sm"
          variant="outline"
          className="text-xs bg-white/80 hover:bg-white border-gray-300"
          type="button"
        >
          <Paperclip size={14} className="mr-1" />
          Dokument hochladen
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
