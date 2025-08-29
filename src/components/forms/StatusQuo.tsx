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
import { loadStatusQuoFormFromStorage } from '@/lib/statusQuoForm'

export default function StatusQuo() {
  const [summaryHtml, setSummaryHtml] = useState<string | null>(null)
  const [opportunities, setOpportunities] = useState<string[]>([])
  const [risks, setRisks] = useState<string[]>([])
  const [opportunitiesHtml, setOpportunitiesHtml] = useState<string>("")
  const [risksHtml, setRisksHtml] = useState<string>("")
  const [sqDisplay, setSqDisplay] = useState(() => ({
    adresse: '', immobilienart: '', wohnungstyp: '', baujahr: '', wohnflaeche: '', zimmer: '', stockwerk: '',
    zustand: '', ausstattung: '', letzteModernisierung: '', energiekennwert: '', istMiete: '', sollMiete: '',
    rechtlicheHinweise: '', ergaenzendeInfos: ''
  }))

  useEffect(() => {
    const raw = localStorage.getItem('analysis.summary')
    if (raw) setSummaryHtml(raw)
    const sq = loadStatusQuoFormFromStorage()
    setOpportunities(Array.isArray(sq.opportunities) ? sq.opportunities : [])
    setRisks(Array.isArray(sq.risks) ? sq.risks : [])
    setOpportunitiesHtml(typeof sq.opportunitiesHtml === 'string' ? sq.opportunitiesHtml : '')
    setRisksHtml(typeof sq.risksHtml === 'string' ? sq.risksHtml : '')
    setSqDisplay({
      adresse: sq.displayAdresse || '',
      immobilienart: sq.displayImmobilienart || '',
      wohnungstyp: sq.displayWohnungstyp || '',
      baujahr: sq.displayBaujahr || '',
      wohnflaeche: sq.displayWohnflaecheLabel || '',
      zimmer: sq.displayZimmerLabel || '',
      stockwerk: sq.displayStockwerkLabel || '',
      zustand: sq.displayZustand || '',
      ausstattung: sq.displayAusstattung || '',
      letzteModernisierung: sq.displayLetzteModernisierung || '',
      energiekennwert: sq.displayEnergiekennwertLabel || '',
      istMiete: sq.displayIstMieteLabel || '',
      sollMiete: sq.displaySollMieteLabel || '',
      rechtlicheHinweise: sq.displayRechtlicheHinweise || '',
      ergaenzendeInfos: sq.displayErgaenzendeInfos || '',
    })
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<any>).detail
      if (detail && typeof detail === 'object') {
        if (typeof detail.summary === 'string') setSummaryHtml(detail.summary)
        // Always refresh from storage in case backend updated status_quo_form
        const sqNow = loadStatusQuoFormFromStorage()
        setOpportunities(Array.isArray(sqNow.opportunities) ? sqNow.opportunities : [])
        setRisks(Array.isArray(sqNow.risks) ? sqNow.risks : [])
        if (typeof detail.opportunitiesHtml === 'string') setOpportunitiesHtml(detail.opportunitiesHtml)
        else setOpportunitiesHtml(typeof sqNow.opportunitiesHtml === 'string' ? sqNow.opportunitiesHtml : '')
        if (typeof detail.risksHtml === 'string') setRisksHtml(detail.risksHtml)
        else setRisksHtml(typeof sqNow.risksHtml === 'string' ? sqNow.risksHtml : '')
        setSqDisplay({
          adresse: sqNow.displayAdresse || '',
          immobilienart: sqNow.displayImmobilienart || '',
          wohnungstyp: sqNow.displayWohnungstyp || '',
          baujahr: sqNow.displayBaujahr || '',
          wohnflaeche: sqNow.displayWohnflaecheLabel || '',
          zimmer: sqNow.displayZimmerLabel || '',
          stockwerk: sqNow.displayStockwerkLabel || '',
          zustand: sqNow.displayZustand || '',
          ausstattung: sqNow.displayAusstattung || '',
          letzteModernisierung: sqNow.displayLetzteModernisierung || '',
          energiekennwert: sqNow.displayEnergiekennwertLabel || '',
          istMiete: sqNow.displayIstMieteLabel || '',
          sollMiete: sqNow.displaySollMieteLabel || '',
          rechtlicheHinweise: sqNow.displayRechtlicheHinweise || '',
          ergaenzendeInfos: sqNow.displayErgaenzendeInfos || '',
        })
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
            <div className="text-sm" style={{ color: '#666666' }}>{sqDisplay.adresse || '—'}</div>
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
                <KeyValue label="Immobilienart" value={sqDisplay.immobilienart || '—'} />
                <KeyValue label="Wohnungstyp" value={sqDisplay.wohnungstyp || '—'} />
                <KeyValue label="Gesamtwohnfläche" value={sqDisplay.wohnflaeche || '—'} />
                <KeyValue label="Anzahl der Zimmer" value={sqDisplay.zimmer || '—'} />
                <KeyValue label="Stockwerk" value={sqDisplay.stockwerk || '—'} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
                <ToolboxIcon /> ZUSTAND & AUSSTATTUNG
              </div>
              <div className="space-y-0.5">
                <KeyValue label="Zustand" value={sqDisplay.zustand || '—'} />
                <KeyValue label="Ausstattung" value={sqDisplay.ausstattung || '—'} />
                <KeyValue label="Letzte Modernisierung" value={sqDisplay.letzteModernisierung || '—'} />
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
                <KeyValue label="Energiekennwert [kWh/m²a]" value={sqDisplay.energiekennwert || '—'} />
                <KeyValue label="Ist-Miete [€]" value={sqDisplay.istMiete || '—'} />
                <KeyValue label="Soll-Miete [€]" value={sqDisplay.sollMiete || '—'} />
                <KeyValue label="Rechtliche Hinweise" value={sqDisplay.rechtlicheHinweise || '—'} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2" style={{ color: '#333333' }}>
                <NoteIcon /> SONSTIGES
              </div>
              <div className="space-y-0.5">
                <KeyValue label="Ergänzende Infos" value={sqDisplay.ergaenzendeInfos || '—'} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Potenziale & Risiken */}
      <div className="space-y-4">
        <SubTitle><NumBadge n={3} /> Potenziale & Risiken</SubTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="uppercase text-[11px] font-semibold tracking-[.12em] mb-3" style={{ color: '#333333' }}>
              POTENZIALE
            </div>
            {opportunitiesHtml && opportunitiesHtml.trim() ? (
              <div className="text-sm leading-[22px] space-y-2" style={{ color: '#666666' }} dangerouslySetInnerHTML={{ __html: opportunitiesHtml }} />
            ) : (
              <p className="text-sm leading-[22px]" style={{ color: '#666666' }}>
                Wird nach Analyse ergänzt.
              </p>
            )}
          </div>
          <div>
            <div className="uppercase text-[11px] font-semibold tracking-[.12em] mb-3" style={{ color: '#333333' }}>
              RISIKEN
            </div>
            {risksHtml && risksHtml.trim() ? (
              <div className="text-sm leading-[22px] space-y-2" style={{ color: '#666666' }} dangerouslySetInnerHTML={{ __html: risksHtml }} />
            ) : (
              <p className="text-sm leading-[22px]" style={{ color: '#666666' }}>
                Wird nach Analyse ergänzt.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
