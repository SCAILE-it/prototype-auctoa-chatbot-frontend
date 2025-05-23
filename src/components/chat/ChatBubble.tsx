
import React from 'react';
import { cn } from '@/lib/utils';

type ChatBubbleProps = {
  isUser: boolean;
  children: React.ReactNode;
};

const ChatBubble = ({ isUser, children }: ChatBubbleProps) => {
  return (
    <div className={cn(
      'max-w-[75%] rounded-2xl p-4 mb-4',
      isUser ? 'ml-auto bg-[#B3B0A6] text-white' : 'mr-auto bg-[#FAF4E6] text-foreground'
    )}>
      {children}
    </div>
  );
};

export default ChatBubble;
