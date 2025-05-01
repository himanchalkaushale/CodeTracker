import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }
  
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for mobile - overlay mode */}
      {isMobile && (
        <>
          <div 
            className={`fixed inset-0 z-20 bg-neutral-900 bg-opacity-50 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeSidebar}
          />
          <aside 
            className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } bg-white dark:bg-neutral-800 shadow-xl`}
          >
            <Sidebar closeSidebar={closeSidebar} />
          </aside>
        </>
      )}
      
      {/* Sidebar for desktop - fixed mode */}
      {!isMobile && (
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-700">
          <Sidebar closeSidebar={closeSidebar} />
        </aside>
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-8">
          <div className="mx-auto max-w-5xl pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}