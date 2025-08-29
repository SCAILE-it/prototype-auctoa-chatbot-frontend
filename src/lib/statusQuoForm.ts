// Status Quo (tab 2) state maintained separately from raw input form

export type StatusQuoForm = {
  summaryHtml: string;
  opportunities: string[]; // Potenziale
  risks: string[]; // Risiken
  opportunitiesHtml?: string; // Raw HTML when backend sends HTML block
  risksHtml?: string; // Raw HTML when backend sends HTML block
  // Display fields for "Immobiliendaten"
  displayAdresse?: string;
  displayImmobilienart?: string;
  displayWohnungstyp?: string;
  displayBaujahr?: string;
  displayWohnflaecheLabel?: string;
  displayZimmerLabel?: string;
  displayStockwerkLabel?: string;
  displayZustand?: string;
  displayAusstattung?: string;
  displayLetzteModernisierung?: string;
  displayEnergiekennwertLabel?: string;
  displayIstMieteLabel?: string;
  displaySollMieteLabel?: string;
  displayRechtlicheHinweise?: string;
  displayErgaenzendeInfos?: string;
  updatedAt: number;
};

const DEFAULT_STATUS_QUO_FORM: StatusQuoForm = {
  summaryHtml: "",
  opportunities: [],
  risks: [],
  updatedAt: 0,
};

export const loadStatusQuoFormFromStorage = (): StatusQuoForm => {
  try {
    const raw = localStorage.getItem("status_quo_form");
    if (!raw) return { ...DEFAULT_STATUS_QUO_FORM };
    const obj = JSON.parse(raw) as Partial<StatusQuoForm>;
    return normalizeIncomingStatusQuoForm(obj);
  } catch {
    return { ...DEFAULT_STATUS_QUO_FORM };
  }
};

export const saveStatusQuoFormToStorage = (value: StatusQuoForm) => {
  localStorage.setItem("status_quo_form", JSON.stringify(value));
};

export const buildStatusQuoFormPayload = (): StatusQuoForm => {
  return loadStatusQuoFormFromStorage();
};

export const normalizeIncomingStatusQuoForm = (value: unknown): StatusQuoForm => {
  const v = (value as any) || {};
  const summaryHtml = typeof v.summaryHtml === "string" ? v.summaryHtml : (typeof v.summary === 'string' ? v.summary : (typeof v.chatResponse === 'string' ? v.chatResponse : ""));
  const toList = (src: any): string[] => {
    if (Array.isArray(src)) return src.filter((x) => typeof x === 'string' && x.trim().length > 0).map((s) => s.trim());
    if (typeof src === 'string') {
      const parts = src
        .split(/\n|•|\u2022|^-\s*/gm)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      return parts;
    }
    return [];
  };
  const isLikelyHtml = (s: unknown) => typeof s === 'string' && /<\s*\w|&lt;\s*\w/i.test(s as string);
  const decodeHtml = (s: string) => {
    if (!s) return s;
    if (!(/[&]lt;|&gt;|&amp;/.test(s))) return s;
    const txt = typeof document !== 'undefined' ? document.createElement('textarea') : null;
    if (!txt) return s;
    txt.innerHTML = s;
    return txt.value;
  };
  // Normalize list or HTML for opportunities
  const srcOpp = (v.opportunities !== undefined ? v.opportunities : v.potential);
  let opportunities: string[] = [];
  let opportunitiesHtml: string | undefined = undefined;
  if (Array.isArray(srcOpp)) {
    const hasHtml = srcOpp.some((s: any) => isLikelyHtml(s));
    if (hasHtml) {
      opportunitiesHtml = decodeHtml(srcOpp.join(""));
    } else {
      opportunities = toList(srcOpp);
    }
  } else if (typeof srcOpp === 'string') {
    if (isLikelyHtml(srcOpp)) {
      opportunitiesHtml = decodeHtml(srcOpp);
    } else {
      opportunities = toList(srcOpp);
    }
  }

  // Normalize list or HTML for risks
  const srcRisk = (v.risks !== undefined ? v.risks : v.risk);
  let risks: string[] = [];
  let risksHtml: string | undefined = undefined;
  if (Array.isArray(srcRisk)) {
    const hasHtml = srcRisk.some((s: any) => isLikelyHtml(s));
    if (hasHtml) {
      risksHtml = decodeHtml(srcRisk.join(""));
    } else {
      risks = toList(srcRisk);
    }
  } else if (typeof srcRisk === 'string') {
    if (isLikelyHtml(srcRisk)) {
      risksHtml = decodeHtml(srcRisk);
    } else {
      risks = toList(srcRisk);
    }
  }
  const updatedAt = Number.isFinite(v.updatedAt) ? Number(v.updatedAt) : Date.now();
  return {
    summaryHtml,
    opportunities,
    risks,
    opportunitiesHtml,
    risksHtml,
    displayAdresse: typeof v.displayAdresse === 'string' ? v.displayAdresse : undefined,
    displayImmobilienart: typeof v.displayImmobilienart === 'string' ? v.displayImmobilienart : undefined,
    displayWohnungstyp: typeof v.displayWohnungstyp === 'string' ? v.displayWohnungstyp : undefined,
    displayBaujahr: typeof v.displayBaujahr === 'string' ? v.displayBaujahr : undefined,
    displayWohnflaecheLabel: typeof v.displayWohnflaecheLabel === 'string' ? v.displayWohnflaecheLabel : undefined,
    displayZimmerLabel: typeof v.displayZimmerLabel === 'string' ? v.displayZimmerLabel : undefined,
    displayStockwerkLabel: typeof v.displayStockwerkLabel === 'string' ? v.displayStockwerkLabel : undefined,
    displayZustand: typeof v.displayZustand === 'string' ? v.displayZustand : undefined,
    displayAusstattung: typeof v.displayAusstattung === 'string' ? v.displayAusstattung : undefined,
    displayLetzteModernisierung: typeof v.displayLetzteModernisierung === 'string' ? v.displayLetzteModernisierung : undefined,
    displayEnergiekennwertLabel: typeof v.displayEnergiekennwertLabel === 'string' ? v.displayEnergiekennwertLabel : undefined,
    displayIstMieteLabel: typeof v.displayIstMieteLabel === 'string' ? v.displayIstMieteLabel : undefined,
    displaySollMieteLabel: typeof v.displaySollMieteLabel === 'string' ? v.displaySollMieteLabel : undefined,
    displayRechtlicheHinweise: typeof v.displayRechtlicheHinweise === 'string' ? v.displayRechtlicheHinweise : undefined,
    displayErgaenzendeInfos: typeof v.displayErgaenzendeInfos === 'string' ? v.displayErgaenzendeInfos : undefined,
    updatedAt
  };
};

// Derive a status_quo_form patch from the raw normalized form for immediate display
import type { NormalizedForm } from '@/lib/form';

export const deriveStatusQuoFromForm = (form: NormalizedForm, existing?: StatusQuoForm): StatusQuoForm => {
  const toStr = (s: string) => (s || '').toString();
  const num = (n: number) => (Number.isFinite(n) ? Number(n) : 0);
  const de = (n: number) => num(n).toLocaleString('de-DE');
  const stockwerkLabel = (() => {
    const n = num(form.stockwerk);
    if (n === 0) return 'EG';
    if (!n) return '';
    return `${n}. OG`;
  })();

  const patch: StatusQuoForm = {
    summaryHtml: existing?.summaryHtml || '',
    opportunities: existing?.opportunities || [],
    risks: existing?.risks || [],
    displayAdresse: toStr(form.adresse),
    displayImmobilienart: toStr(form.immobilienart),
    displayWohnungstyp: toStr(form.wohnungstyp),
    displayBaujahr: form.baujahr ? de(form.baujahr) : '',
    displayWohnflaecheLabel: form.wohnflaeche ? `${de(form.wohnflaeche)} m²` : '',
    displayZimmerLabel: form.zimmer ? de(form.zimmer) : '',
    displayStockwerkLabel: stockwerkLabel,
    displayZustand: toStr(form.zustand),
    displayAusstattung: toStr(form.ausstattung),
    displayLetzteModernisierung: toStr(form.letzteModernisierung),
    displayEnergiekennwertLabel: form.energiekennwert ? `${de(form.energiekennwert)} kWh/m²a` : '',
    displayIstMieteLabel: form.istMiete ? `${de(form.istMiete)} €` : '',
    displaySollMieteLabel: form.sollMiete ? `${de(form.sollMiete)} €` : '',
    displayRechtlicheHinweise: toStr(form.rechtlicheHinweise),
    displayErgaenzendeInfos: toStr(form.ergaenzendeInfos),
    updatedAt: Date.now()
  };

  return patch;
};

export const mergeStatusQuoForm = (existing: StatusQuoForm, incoming: StatusQuoForm): StatusQuoForm => {
  const pick = (inc: string | undefined, ex: string | undefined) =>
    (inc && inc.trim().length > 0 ? inc : (ex || ''));
  const pickArr = (inc?: string[], ex?: string[]) =>
    (inc && inc.length > 0 ? inc : (ex || []));

  return {
    // HTML/text blocks
    summaryHtml: pick(incoming.summaryHtml, existing.summaryHtml),
    opportunitiesHtml: pick(incoming.opportunitiesHtml, existing.opportunitiesHtml),
    risksHtml: pick(incoming.risksHtml, existing.risksHtml),
    // Lists
    opportunities: pickArr(incoming.opportunities, existing.opportunities),
    risks: pickArr(incoming.risks, existing.risks),
    // Display fields stay unless backend provides new values
    displayAdresse: pick(incoming.displayAdresse, existing.displayAdresse),
    displayImmobilienart: pick(incoming.displayImmobilienart, existing.displayImmobilienart),
    displayWohnungstyp: pick(incoming.displayWohnungstyp, existing.displayWohnungstyp),
    displayBaujahr: pick(incoming.displayBaujahr, existing.displayBaujahr),
    displayWohnflaecheLabel: pick(incoming.displayWohnflaecheLabel, existing.displayWohnflaecheLabel),
    displayZimmerLabel: pick(incoming.displayZimmerLabel, existing.displayZimmerLabel),
    displayStockwerkLabel: pick(incoming.displayStockwerkLabel, existing.displayStockwerkLabel),
    displayZustand: pick(incoming.displayZustand, existing.displayZustand),
    displayAusstattung: pick(incoming.displayAusstattung, existing.displayAusstattung),
    displayLetzteModernisierung: pick(incoming.displayLetzteModernisierung, existing.displayLetzteModernisierung),
    displayEnergiekennwertLabel: pick(incoming.displayEnergiekennwertLabel, existing.displayEnergiekennwertLabel),
    displayIstMieteLabel: pick(incoming.displayIstMieteLabel, existing.displayIstMieteLabel),
    displaySollMieteLabel: pick(incoming.displaySollMieteLabel, existing.displaySollMieteLabel),
    displayRechtlicheHinweise: pick(incoming.displayRechtlicheHinweise, existing.displayRechtlicheHinweise),
    displayErgaenzendeInfos: pick(incoming.displayErgaenzendeInfos, existing.displayErgaenzendeInfos),
    updatedAt: Date.now(),
  };
};


