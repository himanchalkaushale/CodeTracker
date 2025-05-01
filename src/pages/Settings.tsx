import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useProgress } from '../context/ProgressContext'
import { FiUser, FiMoon, FiSun, FiDownload, FiUpload, FiTrash2 } from 'react-icons/fi'
import { Problem, DailyProgress, Goal, Streak } from '../types'
import Confirm from '../components/ui/Confirm'

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const { problems, dailyProgress, currentGoal, streak } = useProgress()
  const [isDeleteDataOpen, setIsDeleteDataOpen] = useState(false)
  
  const handleExportData = () => {
    const data = {
      problems,
      dailyProgress,
      currentGoal,
      streak
    }
    
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `codetrack-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
  }
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const data = JSON.parse(json)
        
        // Validate imported data structure
        if (!data.problems || !Array.isArray(data.problems)) {
          throw new Error('Invalid data format: problems array missing')
        }
        
        // Store in localStorage
        localStorage.setItem('cp-tracker-data', json)
        
        // Reload the page to apply imported data
        window.location.reload()
      } catch (error) {
        console.error('Error importing data:', error)
        alert('Failed to import data. Please check the file format.')
      }
    }
    
    reader.readAsText(file)
  }
  
  const handleDeleteAllData = () => {
    localStorage.removeItem('cp-tracker-data')
    window.location.reload()
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Settings</h1>
      
      {/* Theme Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Appearance
        </h2>
        
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 text-neutral-600 dark:text-neutral-400">
                {theme === 'dark' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                  Theme
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Select light or dark theme
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded-md ${
                  theme === 'light' ? 'bg-primary-100 text-primary-800 font-medium' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded-md ${
                  theme === 'dark' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Management */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Data Management
        </h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                Export Data
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Download your problem and progress data as JSON
              </p>
            </div>
            
            <button
              onClick={handleExportData}
              className="btn btn-outline flex items-center"
            >
              <FiDownload className="mr-2" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                Import Data
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Upload previously exported data
              </p>
            </div>
            
            <label className="btn btn-outline flex items-center cursor-pointer">
              <FiUpload className="mr-2" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                Reset Data
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Delete all your data and start fresh (can't be undone)
              </p>
            </div>
            
            <button
              onClick={() => setIsDeleteDataOpen(true)}
              className="btn bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 flex items-center"
            >
              <FiTrash2 className="mr-2" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* About */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          About
        </h2>
        
        <div className="space-y-2">
          <p className="text-neutral-700 dark:text-neutral-300">
            CodeTrack: Daily Progress Tracker for Competitive Programming
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Version 1.0.0
          </p>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
      
      <Confirm
        isOpen={isDeleteDataOpen}
        onClose={() => setIsDeleteDataOpen(false)}
        onConfirm={handleDeleteAllData}
        title="Reset All Data"
        message="Are you sure you want to delete all your data? This action cannot be undone and you will lose all your problem records and progress."
        confirmText="Yes, Delete Everything"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}