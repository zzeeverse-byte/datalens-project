import { UploadZone } from './components/UploadZone'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">DataLens</h1>
        <UploadZone />
      </div>
    </div>
  )
}

export default App
