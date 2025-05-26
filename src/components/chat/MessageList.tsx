import React, { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import FileBubble from "./FileBubble";

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const renderHTML = (html: string) => (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );

  const containerClasses =
    messages.length === 0 && !isTyping
      ? "flex flex-col justify-center items-center min-h-full p-2 md:p-4"
      : "flex flex-col p-2 md:p-4 max-w-4xl mx-auto pb-32";

  return (
    <div className={containerClasses}>
      <div className="text-sm md:text-base w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${
              message.isUser ? "items-end" : "items-start"
            } flex flex-col w-full`}
          >
            {/* Show files ABOVE the message bubble */}
            {message.files?.length > 0 && (
              <div
                className={`mt-1 flex flex-wrap gap-2 ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {message.files.map((file, index) => (
                  <FileBubble
                    key={index}
                    fileName={file.name}
                    isUserMessage={message.isUser}
                  />
                ))}
              </div>
            )}

            {/* Message bubble – only if content or html exists */}
            {(message.content?.trim() || message.html?.trim()) && (
              <ChatBubble isUser={message.isUser}>
                {message.html ? renderHTML(message.html) : message.content}
              </ChatBubble>
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
