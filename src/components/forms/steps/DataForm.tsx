import { useEffect, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Icons
function MapPinIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M12 22s7-5.373 7-11a7 7 0 1 0-14 0c0 5.627 7 11 7 11Z"/>
      <circle cx="12" cy="11" r="2.5"/>
    </svg>
  )
}

function HomeIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"/>
    </svg>
  )
}

function ToolboxIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <rect x="3" y="8" width="18" height="11" rx="2"/>
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <path d="M3 12h18"/>
      <path d="M10 14h4"/>
    </svg>
  )
}

function BoltIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path d="M13 2L3 14h7l-1 8l10-12h-7l1-8Z"/>
    </svg>
  )
}

function NoteIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth={1.75} className={className}>
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
  baujahr: z.coerce.number().int().gte(1800, 'Ungültig').lte(new Date().getFullYear(), 'Ungültig'),
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

  const onSubmit = () => {
    onSuccess?.()
  }

  const inputBase = 'mt-1 block w-full rounded-md bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.22)] placeholder-gray-500 text-gray-800 focus:ring-2 focus:ring-orange-500 px-3.5 py-2.5 text-sm'
  const labelCls = 'text-sm font-medium flex items-center text-gray-500'
  const sectionTitle = 'uppercase text-[11px] font-semibold tracking-[.12em] flex items-center gap-2 text-gray-800 font-serif'

  function RequiredStar() {
    return <span className="ml-1 align-middle text-[12px] font-medium text-gray-500">*</span>
  }

  function ValidationError({ show }: { show: boolean }) {
    if (!show) return null
    return <span className="ml-1 inline-flex items-center justify-center align-middle text-[10px] font-bold text-orange-600 bg-orange-100 rounded-full size-4">!</span>
  }

  const hasIssue = (name: keyof FormValues) => Boolean((errors as any)[name]) && (isSubmitted || Boolean((touchedFields as any)[name]))

  function SelectWrap(props: { children: ReactNode }) {
    return <div className="relative">{props.children}<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40">▾</span></div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section aria-labelledby="standort">
        <h3 id="standort" className={sectionTitle}>
          <MapPinIcon className="text-gray-800" /> STANDORT
        </h3>
        <label className="block mt-3">
          <span className={labelCls}>Adresse <RequiredStar /> <ValidationError show={hasIssue('adresse')} /></span>
          <input {...register('adresse')} placeholder="Bitte auswählen" className={inputBase} />
          {errors.adresse && <p className="text-xs text-red-600 mt-1">{errors.adresse.message}</p>}
        </label>
      </section>

      <section aria-labelledby="basis">
        <h3 id="basis" className={sectionTitle}>
          <HomeIcon className="text-gray-800" /> OBJEKTTYP & BASISDATEN
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <label className="block">
            <span className={labelCls}>Immobilienart <RequiredStar /> <ValidationError show={hasIssue('immobilienart')} /></span>
            <SelectWrap>
              <select {...register('immobilienart')} defaultValue="" className={`${inputBase} appearance-none`}>
                <option value="">Bitte auswählen</option>
                <option value="Wohnung">Wohnung</option>
                <option value="Haus">Haus</option>
                <option value="Mehrfamilienhaus">Mehrfamilienhaus</option>
              </select>
            </SelectWrap>
            {errors.immobilienart && <p className="text-xs text-red-600 mt-1">{errors.immobilienart.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>Wohnungstyp <RequiredStar /> <ValidationError show={hasIssue('wohnungstyp')} /></span>
            <input {...register('wohnungstyp')} placeholder="Bitte auswählen" className={inputBase} />
          </label>
          <label className="block">
            <span className={labelCls}>Baujahr <RequiredStar /> <ValidationError show={hasIssue('baujahr')} /></span>
            <input type="number" inputMode="numeric" {...register('baujahr', { valueAsNumber: true })} placeholder="Bitte auswählen" className={inputBase} />
            {errors.baujahr && <p className="text-sm text-red-600 mt-1">{errors.baujahr.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>Gesamtwohnfläche [m²] <RequiredStar /> <ValidationError show={hasIssue('wohnflaeche')} /></span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('wohnflaeche', { valueAsNumber: true })} placeholder="Bitte auswählen" className={`${inputBase} pr-12`} />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">m²</span>
            </div>
            {errors.wohnflaeche && <p className="text-sm text-red-600 mt-1">{errors.wohnflaeche.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>Anzahl der Zimmer <RequiredStar /> <ValidationError show={hasIssue('zimmer')} /></span>
            <input type="number" inputMode="decimal" step="0.5" {...register('zimmer', { valueAsNumber: true })} placeholder="Bitte auswählen" className={inputBase} />
            {errors.zimmer && <p className="text-sm text-red-600 mt-1">{errors.zimmer.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>Stockwerk <RequiredStar /> <ValidationError show={hasIssue('stockwerk')} /></span>
            <input type="number" inputMode="numeric" {...register('stockwerk', { valueAsNumber: true })} placeholder="Bitte auswählen" className={inputBase} />
            {errors.stockwerk && <p className="text-sm text-red-600 mt-1">{errors.stockwerk.message}</p>}
          </label>
        </div>
      </section>

      <section aria-labelledby="zustand">
        <h3 id="zustand" className={`${sectionTitle} -mt-1`}>
          <span className="relative inline-flex items-center">
            <ToolboxIcon className="text-gray-800 relative -top-[2px] mr-2" size={18} />
            <span className="relative -left-[2px]">ZUSTAND & AUSSTATTUNG</span>
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <label className="block">
            <span className={labelCls}>Zustand <RequiredStar /> <ValidationError show={hasIssue('zustand')} /></span>
            <input {...register('zustand')} placeholder="Bitte auswählen" className={inputBase} />
            {errors.zustand && <p className="text-sm text-red-600 mt-1">{errors.zustand.message}</p>}
          </label>
          <label className="block">
            <span className={labelCls}>Ausstattung <RequiredStar /> <ValidationError show={hasIssue('ausstattung')} /></span>
            <SelectWrap>
              <select {...register('ausstattung')} defaultValue="" className={`${inputBase} appearance-none`}>
                <option value="">Bitte auswählen</option>
                <option value="Standard">Standard</option>
                <option value="Luxus">Luxus</option>
              </select>
            </SelectWrap>
          </label>
          <label className="block">
            <span className={labelCls}>Letzte Modernisierung <RequiredStar /> <ValidationError show={hasIssue('letzteModernisierung')} /></span>
            <input {...register('letzteModernisierung')} placeholder="Bitte auswählen" className={inputBase} />
          </label>
        </div>
      </section>

      <section aria-labelledby="energie">
        <h3 id="energie" className={sectionTitle}>
          <BoltIcon className="text-gray-800" /> ENERGIE & RECHTLICHE ASPEKTE (OPTIONAL)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-500">Energiekennwert [kWh/m²a]</span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('energiekennwert', { valueAsNumber: true })} placeholder="Bitte eintragen" className={`${inputBase} pr-16`} />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">kWh/m²a</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-500">Ist-Miete [€]</span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('istMiete', { valueAsNumber: true })} placeholder="Bitte auswählen" className={`${inputBase} pr-8`} />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">€</span>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-500">Soll-Miete [€]</span>
            <div className="relative">
              <input type="number" inputMode="decimal" {...register('sollMiete', { valueAsNumber: true })} placeholder="Bitte auswählen" className={`${inputBase} pr-8`} />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">€</span>
            </div>
          </label>
          <label className="block md:col-span-2">
            <span className={labelCls}>Rechtliche Hinweise</span>
            <input {...register('rechtlicheHinweise')} placeholder="Bitte eintragen" className={inputBase} />
          </label>
        </div>
      </section>

      <section aria-labelledby="sonstiges">
        <h3 id="sonstiges" className={sectionTitle}>
          <NoteIcon className="text-gray-800" size={18} /> SONSTIGE ANGABEN (OPTIONAL)
        </h3>
        <div className="grid grid-cols-1 gap-4 mt-3">
          <label className="block">
            <span className={labelCls}>Ergänzende Infos</span>
            <textarea rows={4} {...register('ergaenzendeInfos')} placeholder="Bitte eintragen" className={inputBase} />
          </label>
        </div>
      </section>

      <p className="text-[12px] text-red-400 mt-2">
        Bitte ergänze fehlende Informationen, um den Immobilienwert berechnen zu lassen.
      </p>

      <div className="mt-8">
        <button 
          type="submit" 
          disabled={!isValid} 
          className={`w-full rounded-md py-3 font-medium shadow-sm uppercase tracking-[.06em] font-serif ${
            !isValid 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-orange-500 text-white'
          }`}
        >
          Bewertung erhalten
        </button>
      </div>
    </form>
  )
}
