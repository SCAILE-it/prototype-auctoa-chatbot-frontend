import { useEffect, useRef, useState } from "react";
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

  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const scrollEl = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!overlay || !scrollEl || !sentinel) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // If sentinel is not intersecting, messages have reached the top region → show blur
        overlay.style.opacity = entry.isIntersecting ? "0" : "1";
      },
      { root: scrollEl, rootMargin: "0px", threshold: 0.99 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0 relative">
      {/* Sticky, invisible by default blur overlay. Visibility toggled via IntersectionObserver */}
      <div
        ref={overlayRef}
        className="sticky top-0 left-0 right-0 h-16 bg-transparent backdrop-blur-sm pointer-events-none z-10"
        style={{ opacity: 0, transition: "opacity 150ms ease" }}
      />

      {/* Single scroll area lives inside ChatContainer (MessageList) to avoid nested scroll */}
      <div ref={scrollRef} className="flex-1 min-h-0">
        {/* Top sentinel to detect when messages hit the blur region */}
        <div ref={sentinelRef} className="h-16" />
        <ChatContainer messages={messages} isTyping={isTyping} />
      </div>
      <div className="px-2 md:px-3 pb-2 md:pb-4">
        <ChatInput value={input} onChange={setInput} onSendMessage={send} />
      </div>
    </div>
  );
};

export default ChatPanel;


