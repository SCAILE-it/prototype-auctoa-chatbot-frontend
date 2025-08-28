function MapPinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75}>
      <path d="M12 22s7-5.373 7-11a7 7 0 1 0-14 0c0 5.627 7 11 7 11Z"/>
      <circle cx="12" cy="11" r="2.5"/>
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75}>
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"/>
    </svg>
  )
}

function ToolboxIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="8" width="18" height="11" rx="2"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <path d="M3 12h18"/>
      <path d="M10 14h4"/>
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75}>
      <path d="M13 2L3 14h7l-1 8l10-12h-7l1-8Z"/>
    </svg>
  )
}

function NoteIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
      <path d="M14 3v5h5"/>
      <path d="M9 13h6M9 17h6"/>
    </svg>
  )
}

function NumBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[13px] font-semibold" style={{ backgroundColor: '#FDEAD7', color: '#1F2937' }}>{n}</span>
  )
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold flex items-center gap-2" style={{ color: '#1F2937', fontFamily: 'Fraunces, ui-serif, Georgia, serif' }}>{children}</h3>
  )
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm" style={{ color: '#666666' }}>
      <span className="mt-[5px] inline-block w-[6px] h-[6px] aspect-square rounded-full border border-black/60 shrink-0 leading-none" />
      <span className="leading-[22px]"><span className="font-semibold">{label}:</span> {value}</span>
    </div>
  )
}

import { useEffect, useState } from 'react'

export default function StatusQuo() {
  const [summaryHtml, setSummaryHtml] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('analysis.summary')
    if (raw) setSummaryHtml(raw)
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<any>).detail
      if (detail && typeof detail === 'object' && typeof detail.summary === 'string') {
        setSummaryHtml(detail.summary)
      }
    }
    window.addEventListener('analysis:updated', handler as EventListener)
    return () => window.removeEventListener('analysis:updated', handler as EventListener)
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-[28px] font-semibold tracking-[.02em]" style={{ color: '#333', fontFamily: 'Fraunces, ui-serif, Georgia, serif' }}>Status Quo Analyse</h1>

      {/* 1. Zusammenfassung */}
      <div className="space-y-3">
        <SubTitle><NumBadge n={1} /> Zusammenfassung</SubTitle>
        {summaryHtml ? (
          <div className="text-sm leading-[22px]" style={{ color: '#666666' }} dangerouslySetInnerHTML={{ __html: summaryHtml }} />
        ) : (
          <p className="text-sm leading-[22px]" style={{ color: '#666666' }}>
            Sobald die Analyse gestartet wurde, erscheint hier die Zusammenfassung.
          </p>
        )}
      </div>

      {/* 2. Immobiliendaten */}
      <div className="space-y-4">
        <SubTitle><NumBadge n={2} /> Immobiliendaten</SubTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standort */}
          <div className="space-y-2">
            <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
              <MapPinIcon /> STANDORT
            </div>
            <div className="text-sm" style={{ color: '#666666' }}>Flurstraße 8, 90451 Nürnberg-Eibach</div>
            <div className="rounded-[3px] bg-transparent shadow-[0_1px_3px_rgba(0,0,0,0.12)] w-full h-48 flex items-center justify-center text-sm" style={{ color: '#999999' }}>
              Kartenplatzhalter
            </div>
          </div>

          {/* Objekttyp & Basisdaten + Zustand */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
                <HomeIcon /> OBJEKTTYP & BASISDATEN
              </div>
              <div className="space-y-0.5">
                <KeyValue label="Immobilienart" value="Etagenwohnung" />
                <KeyValue label="Gesamtwohnfläche" value="65 m²" />
                <KeyValue label="Anzahl der Zimmer" value="2,5" />
                <KeyValue label="Stockwerk" value="2. OG" />
                <KeyValue label="Aufzug" value="Ja" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
                <ToolboxIcon /> ZUSTAND & AUSSTATTUNG
              </div>
              <div className="space-y-0.5">
                <KeyValue label="Zustand" value="Gut" />
                <KeyValue label="Ausstattung" value="Normal" />
                <KeyValue label="Letzte Modernisierung" value="2019 (Bad & Elektrik)" />
              </div>
            </div>
          </div>

          {/* Energie & Rechtliches + Sonstiges */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
                <BoltIcon /> ENERGIE & RECHTLICHES
              </div>
              <div className="space-y-0.5">
                <KeyValue label="Energiekennwert [kWh/m²a]" value="85 (Klasse C)" />
                <KeyValue label="Mietstatus" value="Vermietet" />
                <KeyValue label="Ist-Miete [€]" value="700" />
                <KeyValue label="Soll-Miete [€]" value="760" />
                <KeyValue label="Rechtliche Hinweise" value="Unbefristeter MV, § 577 BGB Vorkaufsrecht" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
                <NoteIcon /> SONSTIGES
              </div>
              <div className="space-y-0.5">
                <KeyValue label="Besonderheiten" value="Balkon, Fahrstuhl, Einbauküche, Garage, Garten" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Vergleichsobjekte */}
      <div className="space-y-4">
        <SubTitle><NumBadge n={3} /> Vergleichsobjekte</SubTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['87%', '82%', '79%'].map((score, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-[12px] inline-flex items-center px-2 py-1 rounded-full" style={{ backgroundColor: '#eef2ff', color: '#1F2937' }}>
                Matchscore: {score}
              </div>
              <div className="rounded-[3px] overflow-hidden bg-transparent shadow-[0_1px_3px_rgba(0,0,0,0.12)] aspect-[4/3] flex items-center justify-center" style={{ color: '#999999' }}>
                Bildplatzhalter
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
