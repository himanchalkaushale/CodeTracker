import { useProgress } from '../../context/ProgressContext'
import { Category } from '../../types'
import { useTheme } from '../../context/ThemeContext'

export default function CategoryDistribution() {
  const { problems } = useProgress()
  const { theme } = useTheme()
  
  // Get count of problems by category
  const getCategoryCounts = () => {
    const counts: Record<Category, number> = {} as Record<Category, number>
    
    problems.forEach(problem => {
      problem.category.forEach(cat => {
        if (counts[cat]) {
          counts[cat] += 1
        } else {
          counts[cat] = 1
        }
      })
    })
    
    // Sort by count (descending)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Take top 10 categories
  }
  
  const topCategories = getCategoryCounts()
  
  // Find the max count for scaling
  const maxCount = topCategories.length > 0 
    ? topCategories[0][1]
    : 0
  
  // Generate a color based on index
  const getBarColor = (index: number) => {
    const colors = [
      { bg: 'bg-primary-500', bgDark: 'dark:bg-primary-600' },
      { bg: 'bg-secondary-500', bgDark: 'dark:bg-secondary-600' },
      { bg: 'bg-accent-500', bgDark: 'dark:bg-accent-600' },
      { bg: 'bg-warning-500', bgDark: 'dark:bg-warning-600' },
      { bg: 'bg-error-500', bgDark: 'dark:bg-error-600' }
    ]
    
    return colors[index % colors.length]
  }
  
  if (topCategories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
        <p className="text-neutral-500 dark:text-neutral-400">
          Add problems to see category statistics
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-3">
      {topCategories.map(([category, count], index) => {
        const percentage = maxCount ? Math.round((count / maxCount) * 100) : 0
        const { bg, bgDark } = getBarColor(index)
        
        return (
          <div key={category} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {category}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {count} problems
              </span>
            </div>
            <div className="relative h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div 
                className={`absolute h-full left-0 top-0 rounded-full ${bg} ${bgDark} transition-all duration-700 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}