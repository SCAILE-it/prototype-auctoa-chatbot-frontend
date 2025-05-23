
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

  return (
    <div className="flex flex-col overflow-y-auto p-4">
      {messages.map((message) => (
        <div key={message.id} className={`${message.isUser ? 'items-end' : 'items-start'} flex flex-col`}>
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
