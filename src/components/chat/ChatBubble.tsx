// This component represents a chat bubble in a chat interface.
// It displays messages from either the user or the AI, with appropriate styling and avatars.

import React from "react";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  isUser: boolean;
  children: React.ReactNode;
};

const ChatBubble = ({ isUser, children }: ChatBubbleProps) => { // Determines if the message is from the user or AI
  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar only for AI */}
      {!isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-[color:var(--primary-creme)] flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="/uploads/auctoa-icon.png"
            alt="Auctoa"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div
        className={cn(
          "rounded-xl p-3 mb-3 shadow-[2px_2px_12px_0_rgba(0,0,0,0.2)]",
          isUser
            ? "bg-[color:var(--neutral-grey)] text-[color:var(--neutral-dark)]"
            : "bg-[color:var(--primary-creme)] text-[color:var(--neutral-dark)] max-w-[90%] md:max-w-[80%]"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
