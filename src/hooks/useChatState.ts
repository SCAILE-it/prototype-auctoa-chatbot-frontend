import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/lib/chatTypes";
import { convertFileToBase64 } from "@/lib/files";
import { loadSession, saveSession } from "@/lib/session";
import { buildFormPayload, normalizeIncomingForm } from "@/lib/form";
import { resolveApiUrl } from "@/lib/config";
import { buildStatusQuoFormPayload, normalizeIncomingStatusQuoForm, saveStatusQuoFormToStorage } from "@/lib/statusQuoForm";

type ApiResponse = {
  chatResponse: string;
  pills?: string[];
  sources?: { url: string; title: string }[];
  ctaType?:
    | "gutachten"
    | "termin"
    | "makler"
    | "finanzrechner"
    | "anwalt"
    | "ibuyer"
    | "sanierer";
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
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = params.get("prefill");
    const sessionData = loadSession(STORAGE_KEY);

    if (prefill) setInputValue(prefill);
    if (sessionData) {
      if (Array.isArray(sessionData.messages)) setMessages(sessionData.messages);
      if (Array.isArray(sessionData.pills)) setPills(sessionData.pills);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 || pills.length > 0) {
      saveSession(STORAGE_KEY, { messages, pills });
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages, pills]);

  const sendMessage = useCallback(
    async (content: string, uploadedFiles: File[] = []) => {
      if (!content.trim() && uploadedFiles.length === 0) return;

      const resolvedApi = resolveApiUrl(apiUrl);
      console.debug("Resolved API URL:", resolvedApi);
      if (!resolvedApi) {
        console.error("VITE_API_URL is not configured. Received:", apiUrl);
        toast({
          title: "Konfiguration fehlt",
          description: "Die API-URL ist nicht gesetzt (VITE_API_URL).",
          variant: "destructive",
        });
        return;
      }

      const userMessage: Message = {
        id: uuidv4(),
        content,
        isUser: true,
        files: uploadedFiles.map((f) => ({ name: f.name })),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setPills([]);
      setIsTyping(true);

      try {
        const existingId = localStorage.getItem("conversation-id");
        const conversationId = existingId || crypto.randomUUID();
        localStorage.setItem("conversation-id", conversationId);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        const filesEncoded = await Promise.all(uploadedFiles.map((f) => convertFileToBase64(f)));
        const fileStrings = filesEncoded.map((f) => f.base64);

        const form = buildFormPayload();
        const status_quo_form = buildStatusQuoFormPayload();
        let form_complete = false;
        try {
          form_complete = localStorage.getItem("form_complete") === "true";
        } catch {}
        const requestData = { message: content, files: fileStrings, variant, form, form_complete, status_quo_form } as const;

        const response = await fetch(resolvedApi, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-conversation-id": conversationId,
          },
          body: JSON.stringify(requestData),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errText = await response.text().catch(() => "");
          console.error("Chat API error:", response.status, errText);
          throw new Error("Request failed");
        }

        const raw = await response.json();
        const data: ApiResponse = Array.isArray(raw) ? (raw[0]?.output ?? {}) : raw;

        const botMessage: Message = {
          id: uuidv4(),
          content: "",
          html: data.chatResponse,
          isUser: false,
          sources: data.sources || [],
          ctaType: data.ctaType,
        };

        setMessages((prev) => [...prev, botMessage]);
        setPills(data.pills || []);
        setFiles([]);

        // If server returns a canonical form, adopt it and persist
        try {
          const incomingForm = (data as any).form || (data as any).formState || (data as any).forms;
          if (incomingForm && typeof incomingForm === "object") {
            const normalized = normalizeIncomingForm(incomingForm);
            localStorage.setItem("dataform", JSON.stringify(normalized));
            // Broadcast update so the form UI can react immediately without reload
            window.dispatchEvent(new CustomEvent("form:updated", { detail: normalized }));
          }
          const incomingStatusQuoForm = (data as any).status_quo_form;
          if (incomingStatusQuoForm && typeof incomingStatusQuoForm === "object") {
            const normalizedSF = normalizeIncomingStatusQuoForm(incomingStatusQuoForm);
            saveStatusQuoFormToStorage(normalizedSF);
            // Also update summary cache for Status Quo
            localStorage.setItem('analysis.summary', normalizedSF.summaryHtml);
            window.dispatchEvent(new CustomEvent('analysis:updated', { detail: { summary: normalizedSF.summaryHtml } }))
          }
        } catch {}
      } catch (err: any) {
        console.error("Chat request failed:", err);
        if (err?.name !== "AbortError") {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        }
      } finally {
        setIsTyping(false);
      }
    },
    [variant, apiUrl]
  );

  const handleFilesAdded = (newFiles: File[]) => setFiles((prev) => [...prev, ...newFiles]);
  const handleFileRemove = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));
  const clearFiles = () => setFiles([]);

  const resetChat = useCallback(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("conversation-id");
    setMessages([]);
    setIsTyping(false);
    setFiles([]);
    setPills([]);
    setInputValue("");
  }, []);

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
    resetChat,
  };
}

// end
