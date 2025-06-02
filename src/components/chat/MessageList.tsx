import React, { useRef, useEffect } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import ChatBubble from "./ChatBubble";
import FileBubble from "./FileBubble";
import SourcesDropdown from "./SourcesDropdown";
import TypingIndicator from "./TypingIndicator";

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

// Mapping CTA types to their labels and URLs
const CTA_CONFIG = {
  gutachten: {
    label: "Gutachten anfragen",
    url: "https://www.auctoa.de/lead-survey/gutachten",
  },
  termin: {
    label: "Gratis Expertenberatung erhalten",
    url: "https://www.auctoa.de/lead-survey/termin",
  },
  makler: {
    label: "Mit Makler verbunden werden",
    url: "https://www.auctoa.de/lead-survey/ctaID",
  },
  finanzrechner: {
    label: "Finanzierung berechnen",
    url: "https://www.auctoa.de/lead-survey/finanzrechner",
  },
  anwalt: {
    label: "Juristische Beratung sichern",
    url: "https://www.auctoa.de/lead-survey/anwalt",
  },
  ibuyer: {
    label: "Jetzt direkt verkaufen (iBuyer)",
    url: "https://www.auctoa.de/lead-survey/ibuyer",
  },
  sanierer: {
    label: "Sanierungsexperten kontaktieren",
    url: "https://www.auctoa.de/lead-survey/sanierung",
  },
} as const;

const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const renderHTML = (html: string) => (
    <div className="chat-content" dangerouslySetInnerHTML={{ __html: html }} />
  );

  const containerClasses =
    messages.length === 0 && !isTyping
      ? "flex flex-col justify-center items-center min-h-full p-2 md:p-4"
      : "flex flex-col px-2 py-9 md:px-2 md:py-24 max-w-4xl mx-auto pb-36";

  return (
    <div className={containerClasses}>
      <div className="text-sm md:text-base w-full">
        {messages.map((message, i) => (
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

                {message.sources && message.sources.length > 0 && (
                  <SourcesDropdown
                    sources={message.sources}
                    parentRef={messagesEndRef}
                    isLastMessage={i === messages.length - 1} // <== nur wenn letzte Nachricht
                  />
                )}
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
