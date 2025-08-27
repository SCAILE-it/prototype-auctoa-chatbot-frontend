// This component represents the main chat container in a chat interface.
// It displays a list of messages and handles typing indicators and file attachments.

import MessageList from "./MessageList";
import { Message } from "@/lib/chatTypes";

type ChatContainerProps = {
  messages: Message[];
  isTyping: boolean;
  files?: File[];
};

const ChatContainer = ({ messages, isTyping, files }: ChatContainerProps) => {
  return (
    <div className="h-full flex flex-col overflow-hidden min-h-0 relative">
      {/* The MessageList will handle bottom anchoring and internal scroll positioning */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <MessageList messages={messages} isTyping={isTyping} />
      </div>
    </div>
  );
};

export default ChatContainer;
