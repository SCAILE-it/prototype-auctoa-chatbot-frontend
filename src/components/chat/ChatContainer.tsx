import React from "react";
import MessageList, { Message } from "./MessageList";

type ChatContainerProps = {
  messages: Message[];
  isTyping: boolean;
  files: File[];
};

const ChatContainer = ({ messages, isTyping, files }: ChatContainerProps) => {
  return (
    <div className="h-full flex flex-col relative">
      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isTyping={isTyping} files={files} />
      </div>
    </div>
  );
};

export default ChatContainer;
