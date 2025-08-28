import { useEffect, useState } from "react";
import { resolveApiUrl, debugApiResolve } from "@/lib/config";

const STORAGE_KEYS = ["VITE_API_URL", "auctoa-api-url"] as const;

const ApiUrlBanner = () => {
  const [value, setValue] = useState("");
  const [debug, setDebug] = useState<string>("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const resolved = resolveApiUrl();
    setVisible(!resolved);
    const dbg = debugApiResolve();
    setDebug(dbg.url ? `${dbg.source}: ${dbg.url}` : dbg.source);
  }, []);

  if (!visible) return null;

  const save = () => {
    const url = value.trim();
    if (!/^https?:\/\//i.test(url)) return;
    try {
      localStorage.setItem(STORAGE_KEYS[0], url);
      setVisible(false);
      window.location.reload();
    } catch {}
  };

  return (
    <div className="mb-2 p-2 rounded-md bg-yellow-100 text-yellow-900 border border-yellow-300">
      <div className="text-sm mb-1 font-medium">API-URL fehlt</div>
      {debug && (
        <div className="text-[11px] mb-1 opacity-80">Quelle: {debug}</div>
      )}
      <div className="flex gap-2 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://n8n.scaile.it/webhook/... (https optional)"
          className="flex-1 px-2 py-1 rounded border border-yellow-400 bg-white"
        />
        <button onClick={save} className="px-3 py-1 rounded bg-yellow-400 text-black font-medium">
          Speichern
        </button>
      </div>
    </div>
  );
};

export default ApiUrlBanner;


