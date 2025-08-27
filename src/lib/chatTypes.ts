// Shared chat types used across chat components and pages

export type MessageFile = {
  name: string;
  url?: string;
};

export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  files?: MessageFile[];
  html?: string;
  sources?: { title: string; url: string }[];
  ctaType?:
    | "gutachten"
    | "termin"
    | "makler"
    | "finanzrechner"
    | "anwalt"
    | "ibuyer"
    | "sanierer";
};




