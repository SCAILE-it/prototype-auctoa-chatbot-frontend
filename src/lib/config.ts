// Resolve API URL at runtime with multiple fallbacks so the app can work
// even if Vercel env vars are not configured.

const isHttpUrl = (value: string | null | undefined): value is string => {
  if (!value) return false;
  return /^https?:\/\//i.test(value.trim());
};

export function resolveApiUrl(explicit?: string): string | undefined {
  // 1) Explicit param wins
  if (isHttpUrl(explicit)) return explicit!.trim();

  // 2) Build-time env
  const fromEnv = (import.meta as any)?.env?.VITE_API_URL as string | undefined;
  if (isHttpUrl(fromEnv)) return fromEnv!.trim();

  // 3) URL query param ?api=...
  try {
    const apiParam = new URLSearchParams(window.location.search).get("api");
    if (isHttpUrl(apiParam)) return apiParam!.trim();
  } catch {
    // ignore
  }

  // 4) LocalStorage overrides for quick prod testing
  try {
    const ls =
      localStorage.getItem("VITE_API_URL") || localStorage.getItem("auctoa-api-url");
    if (isHttpUrl(ls)) return (ls as string).trim();
  } catch {
    // ignore
  }

  return undefined;
}


