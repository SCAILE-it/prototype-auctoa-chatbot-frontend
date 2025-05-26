
import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

export type MessageFile = {
  name: string;
  url?: string;
};

export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  files?: MessageFile[];
  html?: string;
};

type MessageListProps = {
  messages: Message[];
  isTyping: boolean;
};

const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Function to safely render HTML from the server
  const renderHTML = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col p-2 md:p-4 max-w-4xl mx-auto">
      <div className="text-sm md:text-base w-full">
        {messages.map((message) => (
          <div key={message.id} className={`${message.isUser ? 'items-end' : 'items-start'} flex flex-col w-full`}>
            <ChatBubble isUser={message.isUser}>
              {/* Show message content */}
              {(message.content || message.html) && (
                <div>
                  {message.html ? renderHTML(message.html) : message.content}
                </div>
              )}
              
              {/* Show files within the chat bubble if they exist */}
              {message.files && message.files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.files.map((file, index) => (
                    <div key={index} className="flex items-center px-2 py-1 rounded bg-white/20 text-sm">
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </ChatBubble>
          </div>
        ))}
        
        {isTyping && <TypingIndicator />}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
