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

  const inputWrapRef = useRef<HTMLDivElement>(null);
  const [inputHeight, setInputHeight] = useState<number>(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lastBubbleRef = useRef<HTMLDivElement>(null);
  const [shouldAnchor, setShouldAnchor] = useState<boolean>(false);

  useEffect(() => {
    const el = inputWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setInputHeight(el.offsetHeight || 0);
    });
    ro.observe(el);
    setInputHeight(el.offsetHeight || 0);
    return () => ro.disconnect();
  }, []);

  // When messages change, request anchoring to bottom.
  useEffect(() => {
    if (!scrollerRef.current) return;
    setShouldAnchor(true);
    const id = requestAnimationFrame(() => {
      const sc = scrollerRef.current!;
      const offset = inputHeight + 20;
      sc.scrollTop = sc.scrollHeight - sc.clientHeight - offset;
    });
    return () => cancelAnimationFrame(id);
  }, [messages, inputHeight]);

  // Keep anchoring while last bubble is resizing or while near-bottom.
  useEffect(() => {
    const sc = scrollerRef.current;
    const target = lastBubbleRef.current;
    if (!sc || !target) return;
    const nearBottom = () => sc.scrollHeight - sc.clientHeight - sc.scrollTop < 80;
    const ro = new ResizeObserver(() => {
      if (shouldAnchor || nearBottom()) {
        const offset = inputHeight + 20;
        sc.scrollTop = sc.scrollHeight - sc.clientHeight - offset;
      }
    });
    ro.observe(target);
    const to = setTimeout(() => setShouldAnchor(false), 600);
    return () => {
      ro.disconnect();
      clearTimeout(to);
    };
  }, [shouldAnchor, inputHeight, messages.length]);

  const scrollWrapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Messages scroller mirrors form column behavior */}
      <div
        ref={scrollerRef}
        className="flex-1 min-h-0 overflow-y-auto chat-scroll overscroll-contain flex flex-col h-full"
        style={{ ['--chat-input-h' as any]: `${inputHeight}px` }}
      >
        <ChatContainer messages={messages} isTyping={isTyping} bottomOffset={inputHeight + 20} lastBubbleRef={lastBubbleRef} />
      </div>
      {/* Input sits below the scroller, no sticky/absolute */}
      <div ref={inputWrapRef} className="px-2 md:px-3 pb-2 md:pb-4">
        <ChatInput value={input} onChange={setInput} onSendMessage={send} />
      </div>
    </div>
  );
};

export default ChatPanel;


