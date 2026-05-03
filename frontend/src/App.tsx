import { useState } from 'react'
import { UploadZone } from './components/UploadZone'
import { ProfilePanel } from './components/ProfilePanel'
import { Dashboard } from './components/Dashboard'
import { FilterPanel } from './components/FilterPanel'
import { ChatPanel } from './components/ChatPanel'
import { ExecutiveSummary } from './components/ExecutiveSummary'
import './index.css'

function App() {
  const [tableName, setTableName] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#1e293b' }}>
      <header style={{ backgroundColor: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem 2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', margin: 0 }}>DataLens</h1>
      </header>
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ backgroundColor: 'white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', borderRadius: '1rem', padding: '2rem', minHeight: '500px' }}>
          <UploadZone onUploadSuccess={setTableName} />
          {tableName && (
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <ProfilePanel tableName={tableName} />
              <FilterPanel tableName={tableName} filters={filters} setFilters={setFilters} />
              <Dashboard tableName={tableName} filters={filters} />
              <ChatPanel tableName={tableName} />
              <ExecutiveSummary tableName={tableName} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
