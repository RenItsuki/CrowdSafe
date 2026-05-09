import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import MapView from './components/MapView.jsx'
import Sidebar from './components/Sidebar.jsx'
import AIPanel from './components/AIPanel.jsx'
import ReportModal from './components/ReportModal.jsx'
import Legend from './components/Legend.jsx'
import { useReports } from './hooks/useReports.js'

export default function App() {
  const { reports, addReport, upvoteReport } = useReports()
  const [selectedArea, setSelectedArea] = useState(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  const handleSelectArea = useCallback((area) => {
    setSelectedArea(area)
  }, [])

  const handleSubmitReport = useCallback((data) => {
    addReport(data)
  }, [addReport])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header
        reportCount={reports.length}
        onOpenReport={() => setReportModalOpen(true)}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar */}
        <Sidebar
          reports={reports}
          onSelectArea={handleSelectArea}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
        />

        {/* Map area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <MapView
            reports={activeFilter ? reports.filter(r => r.category === activeFilter) : reports}
            onSelectArea={handleSelectArea}
            selectedArea={selectedArea}
          />
          <Legend />
        </div>

        {/* Right AI panel */}
        {selectedArea && (
          <AIPanel
            selectedArea={selectedArea}
            onClose={() => setSelectedArea(null)}
          />
        )}
      </div>

      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />
    </div>
  )
}
