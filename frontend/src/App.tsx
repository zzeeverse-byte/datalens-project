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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">DataLens</h1>
        <UploadZone onUploadSuccess={setTableName} />
        {tableName && (
          <>
            <ProfilePanel tableName={tableName} />
            <FilterPanel filters={filters} setFilters={setFilters} />
            <Dashboard tableName={tableName} filters={filters} />
            <ChatPanel tableName={tableName} />
            <ExecutiveSummary tableName={tableName} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
