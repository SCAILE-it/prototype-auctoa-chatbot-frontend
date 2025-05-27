import React, { useState } from "react";

type Source = { title: string; url: string };

const SourcesDropdown = ({ sources }: { sources: Source[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 space-y-2">
      {/* Trigger area */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 py-1 px-2 bg-[color:var(--transparent-10)] rounded-full w-fit text-xs text-[color:var(--neutral-grey)] hover:bg-[color:var(--transparent-20)] transition"
      >
        <div className="flex -space-x-2">
          {sources.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full bg-[color:var(--neutral-grey)] text-[color:var(--neutral-dark)] font-medium flex items-center justify-center border border-[color:var(--neutral-light)]"
            >
              🔗
            </div>
          ))}
        </div>
        <span
        className="text-[color:var(--neutral-dark)]">Quellen</span>
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
