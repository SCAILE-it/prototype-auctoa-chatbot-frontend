
import React from 'react';
import { Button } from '@/components/ui/button';

type ChatActionBarProps = {
  cta: {
    text: string;
    action: string;
  } | null;
  onCtaClick: (action: string) => void;
};

const ChatActionBar = ({ cta, onCtaClick }: ChatActionBarProps) => {
  if (!cta) return null;
  
  return (
    <div className="mb-4">
      <Button 
        onClick={() => onCtaClick(cta.action)}
        variant="default"
        className="w-full"
      >
        {cta.text}
      </Button>
    </div>
  );
};

export default ChatActionBar;
