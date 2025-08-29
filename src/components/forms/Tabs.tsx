const steps = [
  { n: 1, label: 'Datenerfassung' },
  { n: 2, label: 'Status Quo Analyse' },
  { n: 3, label: 'Strategische Next Steps' },
] as const

type TabsProps = {
  active: 1 | 2 | 3
  onChange?: (n: 1 | 2 | 3) => void
}

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav role="tablist" aria-label="Schritte" className="p-6 md:p-8 pb-2">
      <div className="flex w-full items-center gap-x-3 gap-y-2 text-sm bg-black/10 backdrop-blur-sm rounded-[3px] px-3 py-2 flex-wrap xl:flex-nowrap min-w-0">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-3 min-w-0">
            <button
              role="tab"
              aria-selected={s.n === active}
              className={[
                'flex items-center gap-2 px-2 py-2 rounded-md select-none min-w-0',
                // lock forward flow until unlocked
                (() => {
                  try {
                    const unlocked = localStorage.getItem('next_steps_unlocked') === 'true'
                    return unlocked ? 'cursor-pointer' : 'cursor-default pointer-events-none'
                  } catch { return 'cursor-default pointer-events-none' }
                })(),
                s.n === active ? 'text-black' : 'text-[#999999]',
              ].join(' ')}
              onClick={() => {
                try {
                  const unlocked = localStorage.getItem('next_steps_unlocked') === 'true'
                  if (!unlocked) return
                } catch {}
                onChange?.(s.n)
              }}
            >
              <span className={[
                'inline-flex items-center justify-center w-6 h-6 aspect-square rounded-full border shrink-0 leading-none',
                s.n === active ? 'border-black text-black bg-transparent' : 'border-black/20 text-[#999999] bg-transparent'
              ].join(' ')}>{s.n}</span>
              <span className="xl:whitespace-nowrap whitespace-normal break-words max-w-full" style={{ fontFamily: 'Fraunces, ui-serif, Georgia, serif', fontWeight: 700, color: s.n === active ? '#333333' : '#999999' }}>{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className="text-[#999999] hidden xl:inline">›</span>}
          </div>
        ))}
      </div>
    </nav>
  )
}
