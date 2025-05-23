
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
      isUser ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-white text-foreground border border-border'
    )}>
      {children}
    </div>
  );
};

export default ChatBubble;
