
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
  files?: File[];
};

const MessageList = ({ messages, isTyping, files = [] }: MessageListProps) => {
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
    : "flex flex-col p-2 md:p-4 max-w-4xl mx-auto pb-32";

  return (
    <div className={containerClasses}>
      <div className="text-sm md:text-base w-full">
        {messages.map((message) => (
          <div key={message.id} className={`${message.isUser ? 'items-end' : 'items-start'} flex flex-col w-full`}>
            <ChatBubble isUser={message.isUser}>
              {/* Show files within the chat bubble if they exist */}
              {message.files && message.files.length > 0 && (
                <div className="mb-3">
                  {message.files.map((file, index) => (
                    <FileBubble 
                      key={index} 
                      fileName={file.name} 
                      isUserMessage={message.isUser}
                      showInBubble={true}
                    />
                  ))}
                </div>
              )}
              
              {/* Show message content */}
              {message.content && (
                <div>
                  {message.html ? renderHTML(message.html) : message.content}
                </div>
              )}
            </ChatBubble>
          </div>
        ))}
        
        {/* Show currently uploading files */}
        {files.length > 0 && (
          <div className="flex flex-col items-end w-full">
            <ChatBubble isUser={true}>
              <div className="mb-2">
                {files.map((file, index) => (
                  <FileBubble 
                    key={index} 
                    fileName={file.name} 
                    isUserMessage={true}
                    showInBubble={true}
                  />
                ))}
              </div>
            </ChatBubble>
          </div>
        )}
        
        {isTyping && <TypingIndicator />}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
