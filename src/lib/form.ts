// Utilities for reading and normalizing the DataForm snapshot stored in localStorage

type RawForm = Partial<{
  adresse: unknown;
  immobilienart: unknown;
  wohnungstyp: unknown;
  baujahr: unknown;
  wohnflaeche: unknown;
  zimmer: unknown;
  stockwerk: unknown;
  zustand: unknown;
  ausstattung: unknown;
  letzteModernisierung: unknown;
  energiekennwert: unknown;
  istMiete: unknown;
  sollMiete: unknown;
  rechtlicheHinweise: unknown;
  ergaenzendeInfos: unknown;
}>;

export type NormalizedForm = Partial<{
  adresse: string;
  immobilienart: string;
  wohnungstyp: string;
  baujahr: number;
  wohnflaeche: number;
  zimmer: number;
  stockwerk: number;
  zustand: string;
  ausstattung: string;
  letzteModernisierung: string;
  energiekennwert: number | null;
  istMiete: number | null;
  sollMiete: number | null;
  rechtlicheHinweise: string | null;
  ergaenzendeInfos: string | null;
}>;

const isEmpty = (v: unknown) => v === undefined || v === null || (typeof v === "string" && v.trim() === "");

const toNumber = (v: unknown): number | null => {
  if (isEmpty(v)) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const toString = (v: unknown): string | null => {
  if (isEmpty(v)) return null;
  return String(v);
};

export const loadDataFormFromStorage = (): RawForm | null => {
  try {
    const raw = localStorage.getItem("dataform");
    return raw ? (JSON.parse(raw) as RawForm) : null;
  } catch {
    return null;
  }
};

export const buildFormPayload = (): NormalizedForm | null => {
  const v = loadDataFormFromStorage();
  if (!v) return null;

  const out: NormalizedForm = {};

  // Required strings
  if (!isEmpty(v.adresse)) out.adresse = String(v.adresse);
  if (!isEmpty(v.immobilienart)) out.immobilienart = String(v.immobilienart);
  if (!isEmpty(v.wohnungstyp)) out.wohnungstyp = String(v.wohnungstyp);
  if (!isEmpty(v.zustand)) out.zustand = String(v.zustand);
  if (!isEmpty(v.ausstattung)) out.ausstattung = String(v.ausstattung);
  if (!isEmpty(v.letzteModernisierung)) out.letzteModernisierung = String(v.letzteModernisierung);

  // Required numbers
  {
    const n = toNumber(v.baujahr);
    if (n !== null) out.baujahr = n;
  }
  {
    const n = toNumber(v.wohnflaeche);
    if (n !== null) out.wohnflaeche = n;
  }
  {
    const n = toNumber(v.zimmer);
    if (n !== null) out.zimmer = n;
  }
  {
    const n = toNumber(v.stockwerk);
    if (n !== null) out.stockwerk = n;
  }

  // Optional fields
  out.energiekennwert = toNumber(v.energiekennwert);
  out.istMiete = toNumber(v.istMiete);
  out.sollMiete = toNumber(v.sollMiete);
  out.rechtlicheHinweise = toString(v.rechtlicheHinweise);
  out.ergaenzendeInfos = toString(v.ergaenzendeInfos);

  return out;
};


