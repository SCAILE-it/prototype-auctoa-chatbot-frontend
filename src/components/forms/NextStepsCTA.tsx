import { IconArrowRight } from "@tabler/icons-react";

type NextStepsCTAProps = {
  onClick: () => void;
  className?: string;
};

export default function NextStepsCTA({ onClick, className }: NextStepsCTAProps) {
  return (
    <button
      type="button"
      aria-label="Strategische Next Steps"
      onClick={onClick}
      className={
        "z-30 " +
        "px-5 md:px-6 py-2.5 md:py-3 rounded-full flex items-center gap-4 " +
        "text-base tracking-[.01em] " +
        "backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.12)] " +
        "hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] " +
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
        (className || "")
      }
      style={{
        background: "rgba(255, 228, 138, 0.85)",
        color: "#1C1C1C",
        fontFamily: 'Fraunces, ui-serif, Georgia, serif',
        fontWeight: 700,
      }}
    >
      <span>Strategische Next Steps</span>
      <IconArrowRight size={18} stroke={2.25} />
    </button>
  );
}


