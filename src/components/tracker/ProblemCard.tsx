import { useState } from 'react'
import { Problem } from '../../types'
import { FiExternalLink, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface ProblemCardProps {
  problem: Problem
  onDelete: (id: string) => void
  onEdit: (problem: Problem) => void
}

export default function ProblemCard({ problem, onDelete, onEdit }: ProblemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
      case 'Medium':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
      case 'Hard':
      case 'Very Hard':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
      case 'Contest':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300'
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Solved':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300'
      case 'Partially Solved':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300'
      case 'Attempted':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300'
      case 'Reviewing':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300'
      case 'To Solve':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
    }
  }
  
  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
  }
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card p-5"
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">{problem.name}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(problem.status)}`}>
                {problem.status}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                {problem.platform}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {problem.link && (
              <a 
                href={problem.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Open problem link"
              >
                <FiExternalLink className="w-5 h-5" />
              </a>
            )}
            <button 
              onClick={() => onEdit(problem)}
              className="text-neutral-500 hover:text-secondary-600 dark:text-neutral-400 dark:hover:text-secondary-400 transition-colors"
              aria-label="Edit problem"
            >
              <FiEdit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(problem.id)}
              className="text-neutral-500 hover:text-error-600 dark:text-neutral-400 dark:hover:text-error-400 transition-colors"
              aria-label="Delete problem"
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {problem.category.map(cat => (
            <span 
              key={cat} 
              className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
            >
              {cat}
            </span>
          ))}
        </div>
        
        {problem.notes && (
          <div className="mb-3">
            <p 
              className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
              onClick={toggleExpand}
            >
              {isExpanded ? problem.notes : truncate(problem.notes, 120)}
            </p>
            {problem.notes.length > 120 && (
              <button 
                onClick={toggleExpand}
                className="text-xs font-medium text-primary-600 dark:text-primary-400 mt-1"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}
        
        <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-auto pt-2">
          <span>{format(new Date(problem.date), 'MMM d, yyyy')}</span>
          <span>{problem.timeSpent} minutes</span>
        </div>
      </div>
    </motion.div>
  )
}