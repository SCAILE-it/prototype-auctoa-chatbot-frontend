import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFileButtonClick?: () => void;
  hasFiles?: boolean;
};

const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Tippen Sie hier...",
  value = "",
  onChange,
  onFileButtonClick,
  hasFiles = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Update internal state when external value changes
  useEffect(() => {
    setMessage(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((message.trim() || hasFiles) && !disabled) {
        onSendMessage(message);
        setMessage("");
      }
    }
  };

  const handleSend = () => {
    if ((message.trim() || hasFiles) && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const canSend = (message.trim() || hasFiles) && !disabled;

  return (
<div className="flex flex-col border bg-[color:var(--primary-creme)] rounded-xl px-3 py-2 gap-y-2">
  {/* Top: Textarea full width */}
  <textarea
    ref={textareaRef}
    value={message}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    placeholder={placeholder}
    disabled={disabled}
    className="w-full resize-none bg-transparent focus:outline-none text-sm min-h-[48px] max-h-[150px]"
    rows={1}
  />

  {/* Bottom: Buttons row with justify-between */}
  <div className="flex items-center justify-between">
    {/* Left: Upload */}
    <Button
      onClick={onFileButtonClick}
      size="icon"
      variant="ghost"
      className="rounded-xl hover:bg-[color:var(--transparent-10)]"
      type="button"
    >
      <Paperclip size={18} />
      <span className="sr-only">Dokument hochladen</span>
    </Button>

    {/* Right: Send */}
    <Button
      onClick={handleSend}
      disabled={!canSend}
      size="icon"
      variant="default"
      className="rounded-xl bg-[color:var(--primary-yellow)] hover:bg-[color:var(--primary-hover)] text-[color:var(--neutral-dark)] disabled:opacity-50"
    >
      <Send size={18} />
      <span className="sr-only">Send message</span>
    </Button>
  </div>
</div>

  );
};

export default ChatInput;
