// Status Quo (tab 2) state maintained separately from raw input form

export type StateForm = {
  summaryHtml: string;
  updatedAt: number;
};

const DEFAULT_STATE_FORM: StateForm = {
  summaryHtml: "",
  updatedAt: 0,
};

export const loadStateFormFromStorage = (): StateForm => {
  try {
    const raw = localStorage.getItem("state_form");
    if (!raw) return { ...DEFAULT_STATE_FORM };
    const obj = JSON.parse(raw) as Partial<StateForm>;
    return normalizeIncomingStateForm(obj);
  } catch {
    return { ...DEFAULT_STATE_FORM };
  }
};

export const saveStateFormToStorage = (value: StateForm) => {
  localStorage.setItem("state_form", JSON.stringify(value));
};

export const buildStateFormPayload = (): StateForm => {
  return loadStateFormFromStorage();
};

export const normalizeIncomingStateForm = (value: unknown): StateForm => {
  const v = (value as any) || {};
  const summaryHtml = typeof v.summaryHtml === "string" ? v.summaryHtml : "";
  const updatedAt = Number.isFinite(v.updatedAt) ? Number(v.updatedAt) : Date.now();
  return { summaryHtml, updatedAt };
};


