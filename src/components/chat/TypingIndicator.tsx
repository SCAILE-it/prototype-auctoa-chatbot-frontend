
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-3 max-w-[100px] bg-white border border-border rounded-2xl mb-4">
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-0"></div>
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-150"></div>
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-300"></div>
    </div>
  );
};

export default TypingIndicator;
