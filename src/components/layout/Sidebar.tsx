import { NavLink } from 'react-router-dom'
import { FiHome, FiList, FiBarChart2, FiSettings, FiGithub, FiCode } from 'react-icons/fi'
import { useProgress } from '../../context/ProgressContext'

interface SidebarProps {
  closeSidebar: () => void
}

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const { streak, getCompletionRate } = useProgress()
  const completionRate = getCompletionRate()
  
  const navItems = [
    { to: '/', icon: <FiHome />, label: 'Dashboard' },
    { to: '/problems', icon: <FiList />, label: 'Problems' },
    { to: '/statistics', icon: <FiBarChart2 />, label: 'Statistics' },
    { to: '/settings', icon: <FiSettings />, label: 'Settings' }
  ]
  
  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-thin">
      {/* Logo & Title */}
      <div className="p-6 flex items-center">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-500 rounded-md flex items-center justify-center">
          <FiCode className="text-white h-6 w-6" />
        </div>
        <h1 className="ml-3 text-xl font-bold text-neutral-900 dark:text-white">
          CodeTrack
        </h1>
      </div>
      
      {/* Stats */}
      <div className="px-6 py-2">
        <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Current streak
              </span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {streak.current} days
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Longest streak
              </span>
              <span className="font-semibold text-secondary-600 dark:text-secondary-400">
                {streak.longest} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Completion rate
              </span>
              <span className="font-semibold text-accent-600 dark:text-accent-400">
                {completionRate.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 rounded-md transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                  }
                `}
              >
                <span className="w-5 h-5 mr-3 flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <FiGithub className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>
    </div>
  )
}