import React, { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

type Source = { title: string; url: string };

const SourcesDropdown = ({ sources }: { sources: Source[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 space-y-2">
      {/* Trigger area */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 py-1 px-3 bg-[color:var(--transparent-10)] rounded-full w-fit text-xs text-[color:var(--neutral-grey)] hover:bg-[color:var(--transparent-20)] transition"
      >
        <span className="text-[color:var(--neutral-dark)] font-medium">
          Quellen
        </span>
        {open ? (
          <IconChevronUp
            size={16}
            className="text-[color:var(--neutral-grey)]"
          />
        ) : (
          <IconChevronDown
            size={16}
            className="text-[color:var(--neutral-grey)]"
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
