import { useEffect, type ReactNode } from 'react'
import { buildFormPayload, normalizeIncomingForm } from '@/lib/form'
import { normalizeIncomingStatusQuoForm, saveStatusQuoFormToStorage } from '@/lib/statusQuoForm'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M12 22s7-5.373 7-11a7 7 0 1 0-14 0c0 5.627 7 11 7 11Z"/>
      <circle cx="12" cy="11" r="2.5"/>
    </svg>
  )
}

function ToolboxIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <rect x="3" y="8" width="18" height="11" rx="2"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <path d="M3 12h18"/>
      <path d="M10 14h4"/>
    </svg>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"/>
    </svg>
  )
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M13 2L3 14h7l-1 8l10-12h-7l1-8Z"/>
    </svg>
  )
}

function NoteIcon({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
      <path d="M14 3v5h5"/>
      <path d="M9 13h6M9 17h6"/>
    </svg>
  )
}

const schema = z.object({
  adresse: z.string().min(1, 'Pflichtfeld'),
  zustand: z.string().min(1, 'Pflichtfeld'),
  ausstattung: z.string().min(1, 'Pflichtfeld'),
  letzteModernisierung: z.string().min(1, 'Pflichtfeld'),
  immobilienart: z.string().min(1, 'Pflichtfeld'),
  wohnungstyp: z.string().min(1, 'Pflichtfeld'),
  baujahr: z.coerce
    .number()
    .int()
    .gte(1800, 'Ungültig')
    .lte(new Date().getFullYear(), 'Ungültig'),
  wohnflaeche: z.coerce.number().positive('Ungültig'),
  zimmer: z.coerce.number().positive('Ungültig'),
  stockwerk: z.coerce.number().int().nonnegative('Ungültig'),
  rechtlicheHinweise: z.string().optional(),
  ergaenzendeInfos: z.string().optional(),
  energiekennwert: z.coerce.number().nonnegative('Ungültig').optional(),
  istMiete: z.coerce.number().nonnegative('Ungültig').optional(),
  sollMiete: z.coerce.number().nonnegative('Ungültig').optional(),
})

type FormValues = z.input<typeof schema>

export default function DataForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register, handleSubmit, reset, watch, formState: { errors, isValid, isSubmitted, touchedFields } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      adresse: '',
      zustand: '',
      ausstattung: '',
      letzteModernisierung: '',
      immobilienart: '',
      wohnungstyp: '',
    },
  })

  useEffect(() => {
    const raw = localStorage.getItem('dataform')
    if (raw) reset(JSON.parse(raw))
  }, [reset])

  useEffect(() => {
    const sub = watch((v) => localStorage.setItem('dataform', JSON.stringify(v)))
    return () => sub.unsubscribe()
  }, [watch])

  // Listen for canonical form updates from chat responses and adopt them
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<any>).detail
      if (detail && typeof detail === 'object') {
        reset(detail)
      }
    }
    window.addEventListener('form:updated', handler as EventListener)
    return () => window.removeEventListener('form:updated', handler as EventListener)
  }, [reset])

  const onSubmit = async () => {
    try {
      localStorage.setItem('form_complete', 'true')
    } catch {}

    // Trigger analysis webhook and switch tab via onSuccess
    onSuccess?.()

    try {
      const conversationId = localStorage.getItem('conversation-id') || crypto.randomUUID()
      localStorage.setItem('conversation-id', conversationId)
      const form = buildFormPayload()
      let form_complete = false
      try { form_complete = localStorage.getItem('form_complete') === 'true' } catch {}
      const res = await fetch('https://n8n.scaile.it/webhook/a2edcb9d-00a4-49e4-aa3f-892b72bf1f03', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-conversation-id': conversationId,
        },
        body: JSON.stringify({ form, form_complete, meta: { conversationId, clientTs: Date.now() } }),
      })
      if (!res.ok) {
        const t = await res.text().catch(() => '')
        console.error('Analysis API error:', res.status, t)
        return
      }
      const raw = await res.json()
      const root = Array.isArray(raw) ? (raw[0] ?? {}) : raw
      const out = root.output ?? root

      // Read summary from status_quo_form.summaryHtml, or fallback keys
      const summaryFromSQ = out?.status_quo_form?.summaryHtml
      const summary = (typeof summaryFromSQ === 'string' && summaryFromSQ) || out.summary || out.chatResponse || ''
      if (typeof summary === 'string' && summary.trim()) {
        localStorage.setItem('analysis.summary', summary)
        window.dispatchEvent(new CustomEvent('analysis:updated', { detail: { summary } }))
      }

      // Adopt canonical form if present
      if (out.form && typeof out.form === 'object') {
        try {
          const normalized = normalizeIncomingForm(out.form)
          localStorage.setItem('dataform', JSON.stringify(normalized))
          window.dispatchEvent(new CustomEvent('form:updated', { detail: normalized }))
        } catch {}
      }

      // Adopt status_quo_form if present
      if (out.status_quo_form && typeof out.status_quo_form === 'object') {
        try {
          const normalizedSQ = normalizeIncomingStatusQuoForm(out.status_quo_form)
          saveStatusQuoFormToStorage(normalizedSQ)
          if (normalizedSQ.summaryHtml && normalizedSQ.summaryHtml.trim()) {
            localStorage.setItem('analysis.summary', normalizedSQ.summaryHtml)
            window.dispatchEvent(new CustomEvent('analysis:updated', { detail: { summary: normalizedSQ.summaryHtml } }))
          }
        } catch {}
      }
    } catch (e) {
      console.error('Analysis request failed:', e)
    }
  }

  const inputBase = 'mt-1 block w-full rounded-md bg-white/20 shadow-[0_1px_3px_rgba(0,0,0,0.12)] placeholder-[#999] text-[#1F2937] focus:ring-2 focus:ring-[color:var(--color-brand-orange)] px-3.5 py-2.5'
  const labelCls = 'text-sm font-medium flex items-center' as const
  const sectionTitle = 'uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2' as const

  function RequiredStar() {
    return <span className="ml-1 align-middle text-[12px] font-medium" style={{ color: '#999999' }}>*</span>
  }

  function Req({ show }: { show: boolean }) {
    if (!show) return null
    return <span className="ml-1 inline-flex items-center justify-center align-middle text-[10px] font-bold text-[color:var(--color-brand-orange)] bg-[#FDEAD7] rounded-full size-4">!</span>
  }

  const hasIssue = (name: keyof FormValues) => Boolean((errors as any)[name]) && (isSubmitted || Boolean((touchedFields as any)[name]))

  function SelectWrap(props: { children: ReactNode }) {
    return <div className="relative">{props.children}<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40">▾</span></div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section aria-labelledby="standort">
        <h3 id="standort" className={sectionTitle} style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
          <MapPinIcon className="text-[#333333]" /> STANDORT
        </h3>
        <label className="block mt-3">
          <span className={labelCls} style={{ color: '#999999' }}>Adresse <RequiredStar /> <Req show={hasIssue('adresse')} /></span>
          <input {...register('adresse')} placeholder="Bitte auswählen" className={inputBase} />
          {errors.adresse && <p className="text-xs text-red-600 mt-1">{errors.adresse.message}</p>}
        </label>
      </section>

      <section aria-labelledby="basis">
        <h3 id="basis" className={sectionTitle} style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
          <HomeIcon className="text-[#333333]" /> OBJEKTTYP & BASISDATEN
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Immobilienart <RequiredStar /> <Req show={hasIssue('immobilienart')} /></span>
            <input {...register('immobilienart')} placeholder="Bitte auswählen" className={inputBase} />
            {errors.immobilienart && <p className="text-xs text-red-600 mt-1">{errors.immobilienart.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Wohnungstyp <RequiredStar /> <Req show={hasIssue('wohnungstyp')} /></span>
            <input {...register('wohnungstyp')} placeholder="Bitte auswählen" className={inputBase} />
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Baujahr <RequiredStar /> <Req show={hasIssue('baujahr')} /></span>
            <input type="number" inputMode="numeric" {...register('baujahr', { valueAsNumber: true })} placeholder="Bitte auswählen" className={inputBase} />
            {errors.baujahr && <p className="text-sm text-red-600 mt-1">{errors.baujahr.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Gesamtwohnfläche [m²] <RequiredStar /> <Req show={hasIssue('wohnflaeche')} /></span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('wohnflaeche', { valueAsNumber: true })} placeholder="Bitte auswählen" className={`${inputBase} pr-12`} />
              <span className="absolute inset-y-0 right-3 flex items-center unit-muted">m²</span>
            </div>
            {errors.wohnflaeche && <p className="text-sm text-red-600 mt-1">{errors.wohnflaeche.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Anzahl der Zimmer <RequiredStar /> <Req show={hasIssue('zimmer')} /></span>
            <input type="number" inputMode="decimal" step="0.5" {...register('zimmer', { valueAsNumber: true })} placeholder="Bitte auswählen" className={inputBase} />
            {errors.zimmer && <p className="text-sm text-red-600 mt-1">{errors.zimmer.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Stockwerk <RequiredStar /> <Req show={hasIssue('stockwerk')} /></span>
            <input type="number" inputMode="numeric" {...register('stockwerk', { valueAsNumber: true })} placeholder="Bitte auswählen" className={inputBase} />
            {errors.stockwerk && <p className="text-sm text-red-600 mt-1">{errors.stockwerk.message}</p>}
          </label>
        </div>
      </section>

      <section aria-labelledby="zustand">
        <h3 id="zustand" className={`${sectionTitle} -mt-1`} style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
          <span className="relative inline-flex items-center">
            <ToolboxIcon className="text-[#333333] relative -top-[2px] mr-2" size={18} />
            <span className="relative -left-[2px]">ZUSTAND & AUSSTATTUNG</span>
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Zustand <RequiredStar /> <Req show={hasIssue('zustand')} /></span>
            <input {...register('zustand')} placeholder="Bitte auswählen" className={inputBase} />
            {errors.zustand && <p className="text-sm text-red-600 mt-1">{errors.zustand.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Ausstattung <RequiredStar /> <Req show={hasIssue('ausstattung')} /></span>
            <input {...register('ausstattung')} placeholder="Bitte auswählen" className={inputBase} />
          </label>
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Letzte Modernisierung <RequiredStar /> <Req show={hasIssue('letzteModernisierung')} /></span>
            <input {...register('letzteModernisierung')} placeholder="Bitte auswählen" className={inputBase} />
          </label>
        </div>
      </section>

      <section aria-labelledby="energie">
        <h3 id="energie" className={sectionTitle} style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
          <BoltIcon className="text-[#333333]" /> ENERGIE & RECHTLICHE ASPEKTE (OPTIONAL)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: '#999999' }}>Energiekennwert [kWh/m²a]</span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('energiekennwert', { valueAsNumber: true })} placeholder="Bitte eintragen" className={`${inputBase} pr-16`} />
              <span className="absolute inset-y-0 right-3 flex items-center unit-muted">kWh/m²a</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: '#999999' }}>Ist-Miete [€]</span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('istMiete', { valueAsNumber: true })} placeholder="Bitte auswählen" className={`${inputBase} pr-8`} />
              <span className="absolute inset-y-0 right-3 flex items-center unit-muted">€</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: '#999999' }}>Soll-Miete [€]</span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('sollMiete', { valueAsNumber: true })} placeholder="Bitte auswählen" className={`${inputBase} pr-8`} />
              <span className="absolute inset-y-0 right-3 flex items-center unit-muted">€</span>
            </div>
          </label>
          <label className="block md:col-span-2">
            <span className={labelCls} style={{ color: '#999999' }}>Rechtliche Hinweise</span>
            <input {...register('rechtlicheHinweise')} placeholder="Bitte eintragen" className={inputBase} />
          </label>
        </div>
      </section>

      <section aria-labelledby="sonstiges">
        <h3 id="sonstiges" className={sectionTitle} style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', color: '#333333' }}>
          <NoteIcon className="text-[#333333]" size={18} /> SONSTIGE ANGABEN (OPTIONAL)
        </h3>
        <div className="grid grid-cols-1 gap-4 mt-3">
          <label className="block">
            <span className={labelCls} style={{ color: '#999999' }}>Ergänzende Infos</span>
            <textarea rows={4} {...register('ergaenzendeInfos')} placeholder="Bitte eintragen" className={inputBase} />
          </label>
        </div>
      </section>

      {!isValid && (
        <p className="text-[12px] text-[#f97373] mt-2">
          Bitte ergänze fehlende Informationen, um den Immobilienwert berechnen zu lassen.
        </p>
      )}

      <div className="mt-8">
        <button
          type="submit"
          disabled={!isValid}
          className="w-full rounded-[12px] py-4 md:py-5 font-semibold uppercase tracking-[.06em] transition-all duration-200 disabled:cursor-not-allowed shadow-[2px_2px_12px_0_rgba(0,0,0,0.2)] hover:-translate-y-[1px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            fontFamily: 'Fraunces, ui-serif, Georgia, serif',
            background: isValid
              ? 'linear-gradient(90deg, #FFE48A 0%, #FFD152 100%)'
              : 'rgba(255,255,255,0.65)',
            color: isValid ? '#1C1C1C' : '#6B7280',
            // no border per spec; rely on shadow and contrast for readability
          }}
        >
          Bewertung erhalten
        </button>
      </div>
    </form>
  )
}
