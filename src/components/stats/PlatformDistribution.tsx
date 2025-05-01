import { useProgress } from '../../context/ProgressContext'
import { Platform } from '../../types'
import { useTheme } from '../../context/ThemeContext'

export default function PlatformDistribution() {
  const { problems } = useProgress()
  const { theme } = useTheme()
  
  // Get count of problems by platform
  const getPlatformCounts = () => {
    const counts: Record<Platform, number> = {} as Record<Platform, number>
    
    problems.forEach(problem => {
      if (counts[problem.platform]) {
        counts[problem.platform] += 1
      } else {
        counts[problem.platform] = 1
      }
    })
    
    // Sort by count (descending)
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
  }
  
  const platformCounts = getPlatformCounts()
  const totalProblems = problems.length
  
  // Generate platform-specific colors
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'LeetCode':
        return { 
          bg: 'bg-[#FFA116]', 
          text: 'text-white',
          darkBg: 'dark:bg-[#FFA116]', 
          darkText: 'dark:text-white'
        }
      case 'CodeForces':
        return { 
          bg: 'bg-[#1890FF]', 
          text: 'text-white',
          darkBg: 'dark:bg-[#1890FF]', 
          darkText: 'dark:text-white'
        }
      case 'HackerRank':
        return { 
          bg: 'bg-[#2EC866]', 
          text: 'text-white',
          darkBg: 'dark:bg-[#2EC866]', 
          darkText: 'dark:text-white'
        }
      case 'AtCoder':
        return { 
          bg: 'bg-white', 
          text: 'text-[#222222]',
          darkBg: 'dark:bg-white', 
          darkText: 'dark:text-[#222222]'
        }
      case 'CodeChef':
        return { 
          bg: 'bg-[#5B4638]', 
          text: 'text-white',
          darkBg: 'dark:bg-[#5B4638]', 
          darkText: 'dark:text-white'
        }
      case 'TopCoder':
        return { 
          bg: 'bg-[#F69322]', 
          text: 'text-white',
          darkBg: 'dark:bg-[#F69322]', 
          darkText: 'dark:text-white'
        }
      case 'SPOJ':
        return { 
          bg: 'bg-[#337AB7]', 
          text: 'text-white',
          darkBg: 'dark:bg-[#337AB7]', 
          darkText: 'dark:text-white'
        }
      default:
        return { 
          bg: 'bg-neutral-500', 
          text: 'text-white',
          darkBg: 'dark:bg-neutral-500', 
          darkText: 'dark:text-white'
        }
    }
  }
  
  if (totalProblems === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
        <p className="text-neutral-500 dark:text-neutral-400">
          Add problems to see platform statistics
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {platformCounts.map(([platform, count]) => {
          const percentage = totalProblems ? Math.round((count / totalProblems) * 100) : 0
          const { bg, text, darkBg, darkText } = getPlatformColor(platform)
          
          return (
            <div 
              key={platform} 
              className="rounded-lg p-3 border border-neutral-200 dark:border-neutral-700 hover:shadow-apple-sm transition-shadow"
            >
              <div className="flex flex-col items-center justify-center">
                <div className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${bg} ${darkBg}`}>
                  <span className={`text-lg font-bold ${text} ${darkText}`}>
                    {platform.substring(0, 2)}
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 text-center">
                  {platform}
                </span>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {count}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}