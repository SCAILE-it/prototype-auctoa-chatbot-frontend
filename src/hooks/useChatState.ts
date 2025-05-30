import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/components/chat/MessageList";

type ApiResponse = {
  chatResponse: string;
  pills?: string[];
  sources?: { url: string; title: string }[];
  ctaType?: "gutachten" | "termin" | "makler";
};

type UseChatStateProps = {
  initialMessages?: Message[];
  variant?: string;
  apiUrl?: string;
};

const STORAGE_KEY = "auctoa-chat-session";

export function useChatState({
  initialMessages = [],
  variant = "valuation",
  apiUrl = import.meta.env.VITE_API_URL,
}: UseChatStateProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [pills, setPills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Load chat history from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (Array.isArray(sessionData.messages)) {
          setMessages(sessionData.messages);
        }
        if (Array.isArray(sessionData.pills)) {
          setPills(sessionData.pills);
        }
      } catch (error) {
        console.error("Failed to parse saved session", error);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, pills }));
    }
  }, [messages, pills]);

  const convertFileToBase64 = (
    file: File
  ): Promise<{ name: string; base64: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ name: file.name, base64: reader.result as string });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = useCallback(
    async (content: string, uploadedFiles: File[] = []) => {
      if (!content.trim() && uploadedFiles.length === 0) return;

      const userMessage: Message = {
        id: uuidv4(),
        content,
        isUser: true,
        files: uploadedFiles.map((file) => ({ name: file.name })),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setPills([]);
      setIsTyping(true);

      // 🔁 BASE64 konvertieren
      const messageFiles = await Promise.all(
        uploadedFiles.map((file) => convertFileToBase64(file))
      );

      const requestData = {
        message: content,
        files: messageFiles,
        variant,
      };

      try {
        const conversationId =
          localStorage.getItem("conversation-id") || crypto.randomUUID();
        localStorage.setItem("conversation-id", conversationId);

        // ✅ LOG: Was wird tatsächlich gesendet?
        console.log("📦 Sending payload to webhook:", {
          conversationId,
          requestData,
        });
        // Send the request to the API
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-conversation-id": conversationId,
          },
          body: JSON.stringify(requestData),
        });


        if (!response.ok) {
          // ❌ LOG: bei Fehlern response body als Text lesen
          const errorText = await response.text();
          console.error("❌ Error response body:", errorText);
          throw new Error("Request failed");
        }

        const data: ApiResponse = await response.json();

        const botMessage: Message = {
          id: uuidv4(),
          content: "",
          html: data.chatResponse,
          isUser: false,
          sources: data.sources || [],
          ctaType: data.ctaType,
        };

        console.log("📦 Bot message:", botMessage);

        setMessages((prev) => [...prev, botMessage]);
        setPills(data.pills || []);
        setFiles([]);
      } catch (error) {
        console.error("❌ Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsTyping(false);
      }
    },
    [variant, apiUrl]
  );

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };
  return {
    messages,
    isTyping,
    files,
    pills,
    inputValue,
    setInputValue,
    sendMessage,
    handleFilesAdded,
    handleFileRemove,
    clearFiles,
  };
}
