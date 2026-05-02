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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">DataLens</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100 min-h-[500px]">
          <UploadZone onUploadSuccess={setTableName} />
          {tableName && (
            <div className="mt-10 space-y-12">
              <ProfilePanel tableName={tableName} />
              <FilterPanel filters={filters} setFilters={setFilters} />
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
