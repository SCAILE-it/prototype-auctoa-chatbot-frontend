
import React from 'react';
import { File, X } from 'lucide-react';

type FileBubbleProps = {
  fileName: string;
  isUserMessage?: boolean;
  onRemove?: () => void;
  showInBubble?: boolean;
};

const FileBubble = ({ fileName, isUserMessage = true, onRemove, showInBubble = false }: FileBubbleProps) => {
  // Extract the file extension to determine the icon
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
  if (showInBubble) {
    return (
      <div className="flex items-center px-2 py-1 rounded bg-white/20 mb-1 text-sm">
        <File size={14} className="mr-2 flex-shrink-0" />
        <span className="truncate">{fileName}</span>
        {onRemove && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="ml-2 p-1 rounded-full hover:bg-black/10 flex-shrink-0"
          >
            <X size={12} />
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center px-3 py-2 rounded-lg bg-secondary ${isUserMessage ? 'ml-auto' : 'mr-auto'} mb-2`}>
      <File size={16} className="mr-2" />
      <span className="text-sm truncate max-w-[200px]">{fileName}</span>
      {onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="ml-2 p-1 rounded-full hover:bg-muted-foreground/20"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default FileBubble;
