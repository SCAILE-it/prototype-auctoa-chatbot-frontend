import React from "react";
import { cn } from "@/lib/utils";
import { IconUser } from "@tabler/icons-react";

type ChatBubbleProps = {
  isUser: boolean;
  children: React.ReactNode;
};

const ChatBubble = ({ isUser, children }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar only for AI */}
      {!isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-[color:var(--primary-creme)] flex items-center justify-center shrink-0">
          <IconUser
            size={20}
            className="text-[color:var(--neutral-dark)]"
          />
        </div>
      )}

      <div
        className={cn(
          "rounded-xl p-3 mb-3",
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
