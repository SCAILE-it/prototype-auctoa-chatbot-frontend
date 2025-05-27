import React from "react";
import { Button } from "@/components/ui/button";

const ChatHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 p-4 md:p-4 px-2 md:px-4 flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/uploads/logo-transparent.png"
          alt="Auctoa Logo"
          className="h-4"
        />
      </div>
      <Button variant="default">Gratis Expertengespräch anfragen</Button>
    </header>
  );
};

export default ChatHeader;
