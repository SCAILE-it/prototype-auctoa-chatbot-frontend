import React, { useState, useEffect } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

type Source = { title: string; url: string };

const SourcesDropdown = ({
  sources,
  parentRef,
  isLastMessage = false,
}: {
  sources: Source[];
  parentRef?: React.RefObject<HTMLDivElement>;
  isLastMessage?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && isLastMessage && parentRef?.current) {
      parentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [open, isLastMessage, parentRef]);

  return (
    <div className="mt-3 space-y-2">
      {/* Trigger area */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 py-1 px-3 bg-transparent  rounded-full w-fit text-xs text-[color:var(--neutral-grey)] transition"
      >
        <span className="text-[color:var(--neutral-dark)] font-medium">
          Quellen
        </span>
        {open ? (
          <IconChevronUp
            size={16}
            className="text-[color:var(--neutral-dark)]"
          />
        ) : (
          <IconChevronDown
            size={16}
            className="text-[color:var(--neutral-dark)]"
          />
        )}
      </button>

      {/* Inline expansion below the button */}
      {open && (
        <ul className="pl-1 space-y-1 text-xs text-[color:var(--neutral-grey)]">
          {sources.map((src, i) => (
            <li key={i}>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[color:var(--neutral-dark)] transition"
              >
                🔗 {src.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SourcesDropdown;
