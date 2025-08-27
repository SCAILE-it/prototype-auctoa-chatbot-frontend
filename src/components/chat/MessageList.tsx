// This component renders a list of messages in the chat interface.
// It handles both user and AI messages, displays files, and includes CTAs for specific actions.

import { useRef, useEffect } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import ChatBubble from "./ChatBubble";
import FileBubble from "./FileBubble";
import SourcesDropdown from "./SourcesDropdown";
import TypingIndicator from "./TypingIndicator";
import { CTA_CONFIG } from "@/lib/ctaConfig";
import { Message } from "@/lib/chatTypes";

type MessageListProps = {
  messages: Message[]; // Array of messages to display in the chat
  isTyping: boolean; // Indicates if the AI is currently typing a response
};

const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the message list whenever messages change or when typing status updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Helper function to render HTML content safely
  // This function uses dangerouslySetInnerHTML to render HTML content in a React component.
  const renderHTML = (html: string) => (
    <div className="chat-content" dangerouslySetInnerHTML={{ __html: html }} />
  );

  // Function to render each message in the list
  // It checks if the message is from the user or AI, and formats it accordingly.
  const renderMessage = (message: Message, index: number) => {
    const isLast = index === messages.length - 1;

    return (
      <div
        key={message.id}
        className={`${
          message.isUser ? "items-end" : "items-start"
        } flex flex-col w-full mb-4 md:mb-2`}
      >
        {message.files?.length > 0 && ( // If the message has files, render them in a bubble
          <div
            className={`mt-1 flex flex-wrap gap-2 ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {message.files.map((file, i) => (
              <FileBubble
                key={i}
                fileName={file.name}
                isUserMessage={message.isUser}
              />
            ))}
          </div>
        )}

        {(message.content?.trim() || // If the message has content or HTML, render it in a chat bubble
          message.html?.trim() ||
          message.ctaType) && (
          <ChatBubble isUser={message.isUser}>
            {message.html ? renderHTML(message.html) : message.content}

            {message.ctaType &&
              CTA_CONFIG[message.ctaType] && ( // If the message has a CTA type, render the corresponding button
                <div className="mt-3">
                  <Button asChild variant="default" size="default">
                    <a
                      href={CTA_CONFIG[message.ctaType].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CTA_CONFIG[message.ctaType].label}
                      <IconArrowUpRight size={14} stroke={2} />
                    </a>
                  </Button>
                </div>
              )}

            {message.sources?.length > 0 && ( // If the message has sources, render the SourcesDropdown component
              <SourcesDropdown
                sources={message.sources}
                parentRef={messagesEndRef}
                isLastMessage={isLast}
              />
            )}
          </ChatBubble>
        )}
      </div>
    );
  };

  const containerClasses =
    messages.length === 0 && !isTyping
      ? "flex flex-col justify-center items-center h-full p-2 md:p-4" // If no messages and not typing, center the content
      : "flex flex-col justify-end h-full px-2 pt-6 pb-28 md:px-2 md:pt-6 md:pb-28 max-w-4xl mx-auto"; // Anchor to bottom with safe paddings (top ~logo-safe, bottom ~input)

  return (
    <div className={containerClasses}>
      <div className="text-sm md:text-base w-full">
        {messages.map(renderMessage)}
        {isTyping && <TypingIndicator />}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
