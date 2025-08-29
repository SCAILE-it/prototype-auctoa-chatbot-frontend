// Status Quo (tab 2) state maintained separately from raw input form

export type StatusQuoForm = {
  summaryHtml: string;
  updatedAt: number;
};

const DEFAULT_STATUS_QUO_FORM: StatusQuoForm = {
  summaryHtml: "",
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
  const summaryHtml = typeof v.summaryHtml === "string" ? v.summaryHtml : "";
  const updatedAt = Number.isFinite(v.updatedAt) ? Number(v.updatedAt) : Date.now();
  return { summaryHtml, updatedAt };
};


