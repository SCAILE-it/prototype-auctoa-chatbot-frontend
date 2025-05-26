
import React, { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import FileBubble from './FileBubble';

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

  // ChatGPT-style layout: center content when no messages, normal flow when messages exist
  const containerClasses = messages.length === 0 && !isTyping 
    ? "flex flex-col justify-center items-center min-h-full p-2 md:p-4"
    : "flex flex-col p-2 md:p-4 max-w-4xl mx-auto";

  return (
    <div className={containerClasses}>
      <div className="text-sm md:text-base">
        {messages.map((message) => (
          <div key={message.id} className={`${message.isUser ? 'items-end' : 'items-start'} flex flex-col w-full`}>
            {message.files && message.files.length > 0 && (
              <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} mb-1`}>
                {message.files.map((file, index) => (
                  <FileBubble 
                    key={index} 
                    fileName={file.name} 
                    isUserMessage={message.isUser}
                  />
                ))}
              </div>
            )}
            
            <ChatBubble isUser={message.isUser}>
              {message.html ? renderHTML(message.html) : message.content}
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
