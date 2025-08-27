import { useState } from "react";
import { v4 as uuid } from "uuid";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { Message } from "@/lib/chatTypes";

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const user: Message = { id: uuid(), content: trimmed, isUser: true };
    setMessages((m) => [...m, user]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: uuid(),
          content:
            "Hallo Inga! Gerne helfe ich euch kostenlos. Lass uns mit ein paar Basisdaten starten – das dauert nur wenige Minuten.",
          isUser: false,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Single scroll area lives inside ChatContainer (MessageList) to avoid nested scroll */}
      <div className="flex-1 min-h-0">
        <ChatContainer messages={messages} isTyping={isTyping} />
      </div>
      <div className="px-2 md:px-3 pb-2 md:pb-4">
        <ChatInput value={input} onChange={setInput} onSendMessage={send} />
      </div>
    </div>
  );
};

export default ChatPanel;


