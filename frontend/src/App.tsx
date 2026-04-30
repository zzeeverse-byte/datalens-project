import { useState } from 'react'
import { UploadZone } from './components/UploadZone'
import { ProfilePanel } from './components/ProfilePanel'
import { Dashboard } from './components/Dashboard'
import './index.css'

function App() {
  const [tableName, setTableName] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">DataLens</h1>
        <UploadZone onUploadSuccess={setTableName} />
        {tableName && (
          <>
            <ProfilePanel tableName={tableName} />
            <Dashboard tableName={tableName} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
