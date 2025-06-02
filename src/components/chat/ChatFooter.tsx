import React from "react";

const ChatFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 py-2 px-2 md:px-4 bg-transparent text-center">
      <div className="flex justify-center space-x-3">
        <a
          href="https://www.auctoa.de/legal/privacy-policy"
          className="text-xs text-[color:var(--neutral-grey)] hover:text-[color:var(--primary-creme)]"
        >
          Datenschutz
        </a>
        <a
          href="https://www.auctoa.de/legal/imprint"
          className="text-xs text-[color:var(--neutral-grey)] hover:text-[color:var(--primary-creme)]"
        >
          Impressum
        </a>
      </div>
    </footer>
  );
};

export default ChatFooter;
