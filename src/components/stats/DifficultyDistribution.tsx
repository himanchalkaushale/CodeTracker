import { useProgress } from '../../context/ProgressContext'
import { Difficulty } from '../../types'
import { useTheme } from '../../context/ThemeContext'

export default function DifficultyDistribution() {
  const { problems } = useProgress()
  const { theme } = useTheme()
  
  // Get count of problems by difficulty
  const getDifficultyCounts = () => {
    const counts: Record<Difficulty, number> = {} as Record<Difficulty, number>
    
    problems.forEach(problem => {
      if (counts[problem.difficulty]) {
        counts[problem.difficulty] += 1
      } else {
        counts[problem.difficulty] = 1
      }
    })
    
    // Define the order
    const order: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Contest']
    
    // Sort by defined order
    return order
      .filter(difficulty => counts[difficulty])
      .map(difficulty => [difficulty, counts[difficulty]])
  }
  
  const difficultyCounts = getDifficultyCounts()
  const totalProblems = problems.length
  
  // Generate difficulty-specific colors
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return { 
          bg: 'bg-success-500', 
          light: 'bg-success-100',
          text: 'text-white',
          lightText: 'text-success-800'
        }
      case 'Medium':
        return { 
          bg: 'bg-warning-500', 
          light: 'bg-warning-100',
          text: 'text-white',
          lightText: 'text-warning-800'
        }
      case 'Hard':
        return { 
          bg: 'bg-error-500', 
          light: 'bg-error-100',
          text: 'text-white',
          lightText: 'text-error-800'
        }
      case 'Very Hard':
        return { 
          bg: 'bg-error-700', 
          light: 'bg-error-100',
          text: 'text-white',
          lightText: 'text-error-800'
        }
      case 'Contest':
        return { 
          bg: 'bg-secondary-500', 
          light: 'bg-secondary-100',
          text: 'text-white',
          lightText: 'text-secondary-800'
        }
      default:
        return { 
          bg: 'bg-neutral-500', 
          light: 'bg-neutral-100',
          text: 'text-white',
          lightText: 'text-neutral-800'
        }
    }
  }
  
  if (totalProblems === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
        <p className="text-neutral-500 dark:text-neutral-400">
          Add problems to see difficulty statistics
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="relative h-8 w-full rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
        {difficultyCounts.reduce((acc, [difficulty, count], index) => {
          const width = (count / totalProblems) * 100
          const { bg } = getDifficultyColor(difficulty as string)
          
          return (
            <>
              {acc}
              <div 
                className={`absolute h-full ${bg}`}
                style={{ 
                  left: `${index > 0 ? difficultyCounts.slice(0, index).reduce((sum, [_, c]) => sum + (c / totalProblems) * 100, 0) : 0}%`,
                  width: `${width}%` 
                }}
              />
            </>
          )
        }, <></>)}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {difficultyCounts.map(([difficulty, count]) => {
          const percentage = totalProblems ? Math.round((count / totalProblems) * 100) : 0
          const { bg, light, text, lightText } = getDifficultyColor(difficulty as string)
          
          return (
            <div key={difficulty as string} className="flex flex-col items-center">
              <div className={`w-full py-2 rounded-md ${light} ${lightText} text-center mb-1`}>
                {difficulty as string}
              </div>
              <div className="text-lg font-bold text-neutral-900 dark:text-white">
                {count} 
                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-1">
                  ({percentage}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}