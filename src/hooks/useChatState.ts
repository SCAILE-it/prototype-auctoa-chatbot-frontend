
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { Message, MessageFile } from '@/components/chat/MessageList';

type ApiResponse = {
  chatResponse: string;
  pills?: string[];
  cta?: {
    text: string;
    action: string;
  };
};

type UseChatStateProps = {
  initialMessages?: Message[];
  variant?: string;
  apiUrl?: string;
};

const STORAGE_KEY = 'auctoa-chat-session';

export function useChatState({
  initialMessages = [],
  variant = 'valuation',
  apiUrl = 'https://webhook.site/your-id-here'
}: UseChatStateProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [pills, setPills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [cta, setCta] = useState<{ text: string; action: string } | null>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData.messages && Array.isArray(sessionData.messages)) {
          setMessages(sessionData.messages);
        }
        if (sessionData.pills && Array.isArray(sessionData.pills)) {
          setPills(sessionData.pills);
        }
      } catch (error) {
        console.error('Failed to parse saved session', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        messages, 
        pills
      }));
    }
  }, [messages, pills]);

  const sendMessage = useCallback(async (content: string, uploadedFiles: File[] = []) => {
    if (!content.trim() && uploadedFiles.length === 0) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      content,
      isUser: true,
      files: uploadedFiles.map(file => ({ name: file.name }))
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPills([]); // Clear pills when user sends a message
    setIsTyping(true);
    
    // Prepare files for API call
    const messageFiles = uploadedFiles.map(file => ({
      name: file.name,
      url: 'https://example.com/files/' + file.name
    }));

    // Prepare data for API call
    const requestData = {
      message: content,
      files: messageFiles,
      variant
    };

    try {
      // Simulate API delay for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API response
      const simulatedResponse: ApiResponse = {
        chatResponse: `<p>Thank you for your inquiry about your property. Based on the information you provided, I can give you an initial assessment.</p>
        <p>Your property in Munich with 212m² of living space and a 330m² plot is likely valued between <strong>€680,000</strong> and <strong>€740,000</strong>.</p>
        <p>For a more accurate valuation, I would need some additional details:</p>
        <ul>
          <li>Current condition of the property</li>
          <li>Features and amenities</li>
          <li>When was the last modernization</li>
        </ul>`,
        pills: [
          "Lohnt sich das Investment unter den gegebenen Bedingungen?",
          "Kriege ich das Objekt gut vermietet?",
          "Wie kann ich den Preis nach unten verhandeln?"
        ],
        cta: {
          text: "Show strategy",
          action: "showStrategy"
        }
      };

      // Add bot response to chat
      const botMessage: Message = {
        id: uuidv4(),
        content: '',
        html: simulatedResponse.chatResponse,
        isUser: false
      };
      
      setMessages(prev => [...prev, botMessage]);
      setPills(simulatedResponse.pills || []);
      setCta(simulatedResponse.cta || null);
      setFiles([]); // Clear files after sending
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  }, [variant]);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return {
    messages,
    isTyping,
    files,
    pills,
    inputValue,
    setInputValue,
    cta,
    sendMessage,
    handleFilesAdded,
    handleFileRemove
  };
}
