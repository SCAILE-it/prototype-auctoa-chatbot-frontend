import { useEffect, useRef, useState, useCallback } from "react";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import FileUploadBar from "./FileUploadBar";
import { useChatState } from "@/hooks/useChatState";
import ApiUrlBanner from "./ApiUrlBanner";

const ChatPanel = () => {
  const getVariant = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("variant") || "valuation";
  };

  const {
    messages,
    isTyping,
    files,
    inputValue,
    setInputValue,
    sendMessage,
    handleFilesAdded,
    handleFileRemove,
    clearFiles,
  } = useChatState({ variant: getVariant() });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text, files);
      clearFiles();
    },
    [sendMessage, files, clearFiles]
  );

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
      <div
        ref={scrollerRef}
        className="flex-1 min-h-0 overflow-y-auto chat-scroll overscroll-contain flex flex-col h-full"
        style={{ ['--chat-input-h' as any]: `${inputHeight}px` }}
      >
        <ChatContainer
          messages={messages}
          isTyping={isTyping}
          bottomOffset={inputHeight + 20}
          lastBubbleRef={lastBubbleRef}
        />
      </div>

      <div ref={inputWrapRef} className="px-2 md:px-3 pb-2 md:pb-4">
        <ApiUrlBanner />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSendMessage={handleSend}
          onFileButtonClick={() => fileInputRef.current?.click()}
          hasFiles={files.length > 0}
          fileBubbles={
            <FileUploadBar
              files={files}
              onFilesAdded={handleFilesAdded}
              onFileRemove={handleFileRemove}
              uploadInputRef={fileInputRef}
            />
          }
        />
      </div>
    </div>
  );
};

export default ChatPanel;


