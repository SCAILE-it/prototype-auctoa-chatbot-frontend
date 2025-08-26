import { useState } from 'react'
import Tabs from './Tabs'
import DataForm from './DataForm'
import NextSteps from './NextSteps'
import StatusQuo from './StatusQuo'

export default function MultiStepForm() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1)
  
  return (
    <div className="max-w-[920px] mx-auto bg-[color:var(--color-cream)] rounded-[3px] shadow-[2px_2px_12px_0_rgba(0,0,0,0.2)] min-h-[calc(100vh-4rem)]">
      <div className="sticky top-0 z-10 bg-transparent rounded-t-[3px]">
        <Tabs active={activeTab} onChange={setActiveTab} />
      </div>
      <div className="p-6 md:p-8">
        {activeTab === 1 && (
          <>
            <h1 className="text-2xl md:text-[28px] font-semibold tracking-[.02em] mb-4" style={{ color: '#333', fontFamily: 'Fraunces, ui-serif, Georgia, serif' }}>
              Datenerfassung
            </h1>
            <DataForm onSuccess={() => setActiveTab(2)} />
          </>
        )}
        {activeTab === 2 && (
          <StatusQuo />
        )}
        {activeTab === 3 && (
          <NextSteps />
        )}
      </div>
    </div>
  )
}