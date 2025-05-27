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
  apiUrl = "https://webhook.site/your-id-here",
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
      setInputValue(""); // ← add this to clear the input
      setPills([]);
      setIsTyping(true);

      // Simulate uploaded file references
      const messageFiles = uploadedFiles.map((file) => ({
        name: file.name,
        url: "https://example.com/files/" + file.name,
      }));

      const requestData = {
        message: content,
        files: messageFiles,
        variant,
      };

      try {
        await new Promise((res) => setTimeout(res, 1500)); // Simulate delay

        const simulatedResponse: ApiResponse = {
          chatResponse: `
            <p>Thank you for your inquiry about your property.</p>
            <p>Your property in Munich with 212m² of living space and a 330m² plot is likely valued between <strong>€680,000</strong> and <strong>€740,000</strong>.</p>
            <p>To improve accuracy, we’d need:</p>
            <ul>
              <li>Condition of the property</li>
              <li>Features and amenities</li>
              <li>Last modernization year</li>
            </ul>`,
          pills: [
            "Lohnt sich das Investment unter den gegebenen Bedingungen?",
            "Kriege ich das Objekt gut vermietet?",
            "Wie kann ich den Preis nach unten verhandeln?",
          ],
          sources: [
            { url: "https://example.com/source1", title: "Source 1" },
            { url: "https://example.com/source2", title: "Source 2" },
          ],
          ctaType: "gutachten",
        };

        const botMessage: Message = {
          id: uuidv4(),
          content: "",
          html: simulatedResponse.chatResponse,
          isUser: false,
          sources: simulatedResponse.sources || [],
          ctaType: simulatedResponse.ctaType,
        };

        setMessages((prev) => [...prev, botMessage]);
        setPills(simulatedResponse.pills || []);
        setFiles([]);
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsTyping(false);
      }
    },
    [variant]
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
