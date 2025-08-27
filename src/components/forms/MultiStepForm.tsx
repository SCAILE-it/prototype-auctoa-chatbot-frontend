import { useState } from 'react'
import Tabs from './Tabs'
import DataForm from './DataForm'
import NextSteps from './NextSteps'
import StatusQuo from './StatusQuo'

export default function MultiStepForm() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1)
  
  return (
    <div className="max-w-[920px] mx-auto bg-[#FAF4E6] rounded-[12px] min-h-full pb-4" style={{ boxShadow: '2px 2px 12px 0 rgba(0,0,0,0.2)' }}>
      <div className="sticky top-[10px] z-10 bg-transparent rounded-t-[3px]">
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