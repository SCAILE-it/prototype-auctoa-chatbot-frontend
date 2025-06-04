// This component is a header for a chat interface, providing branding and a call-to-action button for users to request a free expert consultation. It includes an external link to the Auctoa website and uses Tailwind CSS for styling.

import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-100 p-4 md:p-4 px-2 md:px-4 flex justify-between items-center background-[color:var(--transparent-10)] backdrop-blur-md">
      <div className="flex items-center">
        <a
          href="https://www.auctoa.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/uploads/auctoa-logo-creme.png"
            alt="Auctoa Logo"
            className="h-3 md:h-6"
          />
        </a>
      </div>
      <Button
        asChild
        variant="default"
        className="text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2"
      >
        <a
          href="https://www.auctoa.de/lead-survey/termin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gratis Expertengespräch anfragen
          <IconArrowUpRight size={14} stroke={2} className="ml-1" />
        </a>
      </Button>
    </header>
  );
};

export default ChatHeader;
