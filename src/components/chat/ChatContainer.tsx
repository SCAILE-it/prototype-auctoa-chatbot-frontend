// This component represents the main chat container in a chat interface.
// It displays a list of messages and handles typing indicators and file attachments.

import MessageList from "./MessageList";
import { Message } from "@/lib/chatTypes";

type ChatContainerProps = {
  messages: Message[];
  isTyping: boolean;
  files?: File[];
  bottomOffset?: number; // px to pad bottom so first message sits above input
  lastBubbleRef?: React.RefObject<HTMLDivElement>;
};

const ChatContainer = ({ messages, isTyping, files, bottomOffset = 20, lastBubbleRef }: ChatContainerProps) => {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Viewport ensures the list occupies full available height even with few messages */}
      <div className="flex-1 min-h-0">
        <MessageList messages={messages} isTyping={isTyping} bottomOffset={bottomOffset} lastBubbleRef={lastBubbleRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
