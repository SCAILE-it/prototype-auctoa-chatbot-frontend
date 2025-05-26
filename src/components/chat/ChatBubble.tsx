import React from "react";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  isUser: boolean;
  children: React.ReactNode;
};

const ChatBubble = ({ isUser, children }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-xl p-3 mb-3",
        isUser
          ? "ml-auto bg-[color:var(--neutral-grey)] text-[color:var(--neutral-dark)]"
          : "mr-auto bg-[color:var(--primary-creme)] text-[color:var(--neutral-dark)]"
      )}
    >
      {children}
    </div>
  );
};

export default ChatBubble;
