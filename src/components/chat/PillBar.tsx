import React from "react";
import { Button } from "@/components/ui/button";

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
          className="rounded-full text-sm bg-[color:var(--transparent-10)] backdrop-blur-md hover:bg-[color:var(--transparent-20)] text-[color:var(--primary-creme)]"
          onClick={() => onPillClick(pill)}
        >
          <span
            className="block md:hidden truncate max-w-[calc(100vw-4rem)]"
            title={pill}
          >
            {pill}
          </span>
          <span className="hidden md:block">{pill}</span>
        </Button>
      ))}
    </div>
  );
};

export default PillBar;
