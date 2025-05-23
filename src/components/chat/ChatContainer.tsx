
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import MessageList, { Message, MessageFile } from './MessageList';
import ChatInput from './ChatInput';
import PillBar from './PillBar';
import FileUploadBar from './FileUploadBar';
import { Button } from '@/components/ui/button';

type CTAButton = {
  text: string;
  action: string;
};

type ApiResponse = {
  chatResponse: string;
  pills?: string[];
  cta?: CTAButton;
};

type ChatContainerProps = {
  variant?: string;
  initialMessages?: Message[];
  onPillClick?: (pill: string) => void;
  onCtaClick?: (action: string) => void;
  apiUrl?: string;
};

const STORAGE_KEY = 'auctoa-chat-session';

const ChatContainer = ({ 
  variant = 'valuation',
  initialMessages = [], 
  onPillClick,
  onCtaClick,
  apiUrl = 'https://webhook.site/your-id-here' // replace with actual endpoint
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [pills, setPills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [cta, setCta] = useState<CTAButton | null>(null);

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
    // In a real implementation, you would upload these files and get URLs back
    // For this MVP, we'll simulate that
    const messageFiles = uploadedFiles.map(file => ({
      name: file.name,
      url: 'https://example.com/files/' + file.name // This would be a real URL in production
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
      
      // In a real implementation, you would make an actual API call:
      // const response = await fetch(apiUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestData)
      // });
      // const data: ApiResponse = await response.json();
      
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

  const handlePillClick = (pillText: string) => {
    setInputValue(pillText);
    if (onPillClick) {
      onPillClick(pillText);
    }
  };

  const handleCtaClick = (action: string) => {
    if (onCtaClick) {
      onCtaClick(action);
    } else {
      // Default CTA behavior
      toast({
        title: "Action clicked",
        description: `Action: ${action}`,
      });
    }
  };

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message, files);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <PillBar pills={pills} onPillClick={handlePillClick} />
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
      </div>

      <div className="p-4 border-t bg-background sticky bottom-0">
        {cta && (
          <div className="mb-4">
            <Button 
              onClick={() => handleCtaClick(cta.action)}
              variant="default"
              className="w-full"
            >
              {cta.text}
            </Button>
          </div>
        )}
        <FileUploadBar 
          files={files}
          onFilesAdded={handleFilesAdded}
          onFileRemove={handleFileRemove}
        />
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          value={inputValue}
          onChange={setInputValue}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
