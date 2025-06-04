// This component renders a pill bar with clickable pills.
// It allows users to click on pills to trigger an action.

import { Button } from "@/components/ui/button";

type PillBarProps = {
  pills: string[]; // Array of pills to display in the bar coming from n8n response
  onPillClick: (pill: string) => void; // Callback function to handle pill click events
};

const PillBar = ({ pills, onPillClick }: PillBarProps) => {
  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill, index) => (
        <Button
          key={index}
          variant="outline"
          className="rounded-full text-sm bg-[color:var(--secondary-lightyellow)] backdrop-blur-md hover:bg-[color:var(--primary-yellow)] text-[color:var(--neutral-dark)]"
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
