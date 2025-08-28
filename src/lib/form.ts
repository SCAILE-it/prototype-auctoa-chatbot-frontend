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

  const payload: NormalizedForm = {
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

  // Read form_complete only from storage (set on user action), default false
  // form_complete is handled and stored separately, not embedded inside the form

  return payload;
};

// Normalize a form object coming from the server into our type-stable shape
export const normalizeIncomingForm = (value: unknown): NormalizedForm => {
  const v = (value as any) || {};
  const isEmpty = (val: unknown) => val === undefined || val === null || (typeof val === "string" && val.trim() === "");
  const str = (val: unknown) => (isEmpty(val) ? "" : String(val));
  const toNumber = (val: unknown): number => {
    if (isEmpty(val)) return 0;
    const n = typeof val === "number" ? val : Number(val);
    return Number.isFinite(n) ? n : 0;
  };
  const payload: NormalizedForm = {
    adresse: str(v.adresse),
    immobilienart: str(v.immobilienart),
    wohnungstyp: str(v.wohnungstyp),
    baujahr: toNumber(v.baujahr),
    wohnflaeche: toNumber(v.wohnflaeche),
    zimmer: toNumber(v.zimmer),
    stockwerk: toNumber(v.stockwerk),
    zustand: str(v.zustand),
    ausstattung: str(v.ausstattung),
    letzteModernisierung: str(v.letzteModernisierung),
    energiekennwert: toNumber(v.energiekennwert),
    istMiete: toNumber(v.istMiete),
    sollMiete: toNumber(v.sollMiete),
    rechtlicheHinweise: str(v.rechtlicheHinweise),
    ergaenzendeInfos: str(v.ergaenzendeInfos),
  };
  return payload;
};


