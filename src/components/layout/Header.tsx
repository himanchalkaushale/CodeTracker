import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { FiMenu, FiSun, FiMoon, FiSearch } from 'react-icons/fi'
import { useState } from 'react'
import { useProgress } from '../../context/ProgressContext'

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { streak } = useProgress()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  return (
    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-10">
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl font-semibold ml-2 lg:ml-0 text-primary-600 dark:text-primary-500">
            CodeTrack
          </h1>
          
          <div className="hidden md:flex md:ml-4 items-center">
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Current streak:
            </span>
            <span className="ml-2 py-1 px-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded font-medium text-sm">
              {streak.current} days
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Search button */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 mr-2"
            aria-label={isSearchOpen ? "Close search" : "Open search"}
          >
            <FiSearch className="h-5 w-5" />
          </button>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
            aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Search bar */}
      <div className={`bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600 transition-all duration-300 ${
        isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="mx-auto max-w-5xl px-4 py-3">
          <input 
            type="text" 
            placeholder="Search problems, categories, or platforms..." 
            className="input w-full"
            aria-label="Search problems"
          />
        </div>
      </div>
    </header>
  )
}