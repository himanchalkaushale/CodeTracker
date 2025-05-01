import { useState } from 'react'
import ProgressChart from '../components/stats/ProgressChart'
import CategoryDistribution from '../components/stats/CategoryDistribution'
import PlatformDistribution from '../components/stats/PlatformDistribution'
import DifficultyDistribution from '../components/stats/DifficultyDistribution'
import { useProgress } from '../context/ProgressContext'
import { format, subDays, parseISO } from 'date-fns'

export default function Statistics() {
  const { problems, dailyProgress } = useProgress()
  const [timeRange, setTimeRange] = useState<7 | 14 | 30 | 90>(30)
  
  // Calculate stats
  const getTotalSolved = () => {
    return problems.filter(p => p.status === 'Solved').length
  }
  
  const getProblemsInRange = () => {
    const cutoffDate = subDays(new Date(), timeRange)
    return problems.filter(p => new Date(p.date) >= cutoffDate).length
  }
  
  const getAveragePerDay = () => {
    const cutoffDate = subDays(new Date(), timeRange)
    const relevantDays = dailyProgress.filter(p => new Date(p.date) >= cutoffDate)
    
    if (relevantDays.length === 0) return 0
    
    const totalSolved = relevantDays.reduce((sum, day) => sum + day.problemsCompleted, 0)
    return totalSolved / relevantDays.length
  }
  
  const getAverageTimePerProblem = () => {
    const cutoffDate = subDays(new Date(), timeRange)
    const relevantDays = dailyProgress.filter(p => new Date(p.date) >= cutoffDate)
    
    if (relevantDays.length === 0) return 0
    
    const totalTime = relevantDays.reduce((sum, day) => sum + day.timeSpent, 0)
    const totalSolved = relevantDays.reduce((sum, day) => sum + day.problemsCompleted, 0)
    
    return totalSolved ? Math.round(totalTime / totalSolved) : 0
  }
  
  // Get dates for chart
  const getDateLabel = () => {
    const now = new Date()
    const past = subDays(now, timeRange)
    return `${format(past, 'MMM d')} - ${format(now, 'MMM d, yyyy')}`
  }
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Statistics</h1>
      
      {/* Time Range Selector */}
      <div className="flex justify-between items-center bg-white dark:bg-neutral-800 rounded-lg shadow-apple-sm p-4 border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
          {getDateLabel()}
        </h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange(7)} 
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 7 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            7d
          </button>
          <button 
            onClick={() => setTimeRange(14)} 
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 14 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            14d
          </button>
          <button 
            onClick={() => setTimeRange(30)} 
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 30 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            30d
          </button>
          <button 
            onClick={() => setTimeRange(90)} 
            className={`px-3 py-1 text-sm rounded-md ${
              timeRange === 90 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            90d
          </button>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-5">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Problems Solved</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
              {getProblemsInRange()}
            </p>
            <p className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
              of {getTotalSolved()} total
            </p>
          </div>
        </div>
        
        <div className="card p-5">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Avg. Problems / Day</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
              {getAveragePerDay().toFixed(1)}
            </p>
          </div>
        </div>
        
        <div className="card p-5">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Avg. Time / Problem</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
              {getAverageTimePerProblem()}
            </p>
            <p className="ml-1 text-sm text-neutral-600 dark:text-neutral-400">min</p>
          </div>
        </div>
        
        <div className="card p-5">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Success Rate</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-neutral-900 dark:text-white">
              {problems.length ? Math.round((getTotalSolved() / problems.length) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
      
      {/* Progress Chart */}
      <div className="card p-5">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Problems Solved Over Time
        </h3>
        <ProgressChart days={timeRange} />
      </div>
      
      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Problem Categories
          </h3>
          <CategoryDistribution />
        </div>
        
        <div className="card p-5">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Problem Difficulty
          </h3>
          <DifficultyDistribution />
        </div>
      </div>
      
      <div className="card p-5">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Platform Distribution
        </h3>
        <PlatformDistribution />
      </div>
    </div>
  )
}