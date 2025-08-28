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

export type NormalizedForm = {
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
  energiekennwert: number;
  istMiete: number;
  sollMiete: number;
  rechtlicheHinweise: string;
  ergaenzendeInfos: string;
};

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

export const buildFormPayload = (): NormalizedForm => {
  const v = loadDataFormFromStorage() || {};

  // Always include all fields. Strings default to "", numbers to 0.
  const str = (val: unknown) => (isEmpty(val) ? "" : String(val));
  const num = (val: unknown) => {
    const n = toNumber(val);
    return n === null ? 0 : n;
  };

  return {
    adresse: str((v as any).adresse),
    immobilienart: str((v as any).immobilienart),
    wohnungstyp: str((v as any).wohnungstyp),
    baujahr: num((v as any).baujahr),
    wohnflaeche: num((v as any).wohnflaeche),
    zimmer: num((v as any).zimmer),
    stockwerk: num((v as any).stockwerk),
    zustand: str((v as any).zustand),
    ausstattung: str((v as any).ausstattung),
    letzteModernisierung: str((v as any).letzteModernisierung),
    energiekennwert: num((v as any).energiekennwert),
    istMiete: num((v as any).istMiete),
    sollMiete: num((v as any).sollMiete),
    rechtlicheHinweise: str((v as any).rechtlicheHinweise),
    ergaenzendeInfos: str((v as any).ergaenzendeInfos),
  };
};


