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
  content: string; // Text content of the message (user)
  isUser: boolean; // Indicates if the message is from the user (true) or the AI (false)
  files?: MessageFile[]; // Optional array of files attached to the message
  html?: string; // Optional HTML content for the message (AI)
  sources?: { title: string; url: string }[]; // Optional sources for the message, each with a title and URL
  ctaType?: "gutachten" | "termin" | "makler"; // Optional CTA type for specific message actions
};

type MessageListProps = {
  messages: Message[];
  isTyping: boolean;
};

const CTA_CONFIG = {
  gutachten: {
    label: "Physisches Gutachten anfragen",
    url: "https://example.com/gutachten",
  },
  termin: {
    label: "Gratis Expertenberatung erhalten",
    url: "https://example.com/beratung",
  },
  makler: {
    label: "Mit Makler verbunden werden",
    url: "https://example.com/makler",
  },
} as const;

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
            } flex flex-col w-full mb-6`}
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
            {(message.content?.trim() ||
              message.html?.trim() ||
              message.ctaType) && (
              <ChatBubble isUser={message.isUser}>
                {/* Chat content */}
                {message.html ? renderHTML(message.html) : message.content}

                {/* CTA inside the bubble */}
                {message.ctaType && CTA_CONFIG[message.ctaType] && (
                  <div className="mt-3">
                    <a
                      href={CTA_CONFIG[message.ctaType].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[color:var(--primary-yellow)] text-[color:var(--neutral-dark)] text-sm font-medium px-4 py-2 rounded-xl hover:bg-[color:var(--primary-hover)] transition-colors"
                    >
                      {CTA_CONFIG[message.ctaType].label}
                    </a>
                  </div>
                )}
              </ChatBubble>
            )}

            {/* Sources – only if there's at least one source provided */}
            {message.sources && message.sources.length > 0 && (
              <div className="mt-1 text-xs text-[color:var(--neutral-grey)]">
                <p className="mb-1 font-medium">Quellen:</p>
                <ul className="list-disc pl-4">
                  {message.sources.map((src, i) => (
                    <li key={i}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[color:var(--neutral-grey)] hover:text-[color:var(--primary-creme)]"
                      >
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
