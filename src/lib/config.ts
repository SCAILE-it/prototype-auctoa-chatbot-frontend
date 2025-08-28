// Resolve API URL at runtime with multiple fallbacks so the app can work
// even if Vercel env vars are not configured.

const normalizeUrl = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  let v = String(value).trim();
  if (!v) return undefined;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`; // auto-prepend https
  try {
    const u = new URL(v);
    return u.toString();
  } catch {
    return undefined;
  }
};

// Final hardcoded default (from README) so production still works without envs
const DEFAULT_API_URL = "https://n8n.scaile.it/webhook/c8298f2e-aa44-40ae-bc0e-3ce4dd93d1f2";

export type ApiSource = "explicit" | "env" | "query" | "localStorage" | "default" | "none";

export function resolveApiUrl(explicit?: string): string | undefined {
  // 1) Explicit param wins
  const fromExplicit = normalizeUrl(explicit);
  if (fromExplicit) return fromExplicit;

  // 2) Build-time env
  const fromEnv = normalizeUrl((import.meta as any)?.env?.VITE_API_URL as string | undefined);
  if (fromEnv) return fromEnv;

  // 3) URL query param ?api=...
  try {
    const apiParam = new URLSearchParams(window.location.search).get("api");
    const fromQuery = normalizeUrl(apiParam || undefined);
    if (fromQuery) return fromQuery;
  } catch {
    // ignore
  }

  // 4) LocalStorage overrides for quick prod testing
  try {
    const ls =
      localStorage.getItem("VITE_API_URL") || localStorage.getItem("auctoa-api-url");
    const fromLs = normalizeUrl(ls || undefined);
    if (fromLs) return fromLs;
  } catch {
    // ignore
  }

  // 5) Hardcoded default from README
  return normalizeUrl(DEFAULT_API_URL);
}

export function debugApiResolve(explicit?: string): { url?: string; source: ApiSource } {
  const exp = normalizeUrl(explicit);
  if (exp) return { url: exp, source: "explicit" };

  const envVal = normalizeUrl((import.meta as any)?.env?.VITE_API_URL as string | undefined);
  if (envVal) return { url: envVal, source: "env" };

  try {
    const apiParam = new URLSearchParams(window.location.search).get("api");
    const q = normalizeUrl(apiParam || undefined);
    if (q) return { url: q, source: "query" };
  } catch {}

  try {
    const ls =
      localStorage.getItem("VITE_API_URL") || localStorage.getItem("auctoa-api-url");
    const l = normalizeUrl(ls || undefined);
    if (l) return { url: l, source: "localStorage" };
  } catch {}

  const d = normalizeUrl(DEFAULT_API_URL);
  if (d) return { url: d, source: "default" };
  return { source: "none" };
}


