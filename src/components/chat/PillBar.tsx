
import React from 'react';
import { Button } from '@/components/ui/button';

type PillBarProps = {
  pills: string[];
  onPillClick: (pill: string) => void;
};

const PillBar = ({ pills, onPillClick }: PillBarProps) => {
  if (pills.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill, index) => (
        <Button
          key={index}
          variant="outline"
          className="rounded-full text-sm bg-[#FCECC9] border-[#FCECC9] hover:bg-[#FCECC9]/80 text-black"
          onClick={() => onPillClick(pill)}
        >
          {pill}
        </Button>
      ))}
    </div>
  );
};

export default PillBar;
