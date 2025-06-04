// This variable holds the configuration for various call-to-action (CTA) links used in the application.
// You can use this configuration to dynamically generate buttons or links that lead to specific actions, such as requesting an appraisal, scheduling a consultation, or connecting with a real estate agent.
// These are rendered in the MessageList component when the AI provides a response that includes a CTA type.
// Adapt the type Message (ctaType) with the respective type from CTA_CONFIG to render the correct button.

export const CTA_CONFIG = {
  gutachten: {
    label: "Gutachten anfragen",
    url: "https://www.auctoa.de/lead-survey/gutachten",
  },
  termin: {
    label: "Gratis Expertenberatung erhalten",
    url: "https://www.auctoa.de/lead-survey/termin",
  },
  makler: {
    label: "Mit Makler verbunden werden",
    url: "https://www.auctoa.de/lead-survey/makler",
  },
  finanzrechner: {
    label: "Finanzierung berechnen",
    url: "https://www.auctoa.de/lead-survey/finanzrechner",
  },
  anwalt: {
    label: "Juristische Beratung sichern",
    url: "https://www.auctoa.de/lead-survey/anwalt",
  },
  ibuyer: {
    label: "Jetzt direkt verkaufen",
    url: "https://www.auctoa.de/lead-survey/ibuyer",
  },
  sanierer: {
    label: "Sanierungsexperten kontaktieren",
    url: "https://www.auctoa.de/lead-survey/sanierung",
}}  as const;
