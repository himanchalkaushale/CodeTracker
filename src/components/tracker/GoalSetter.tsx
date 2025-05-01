import { useState } from 'react'
import { useProgress } from '../../context/ProgressContext'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

interface GoalSetterProps {
  onClose: () => void
}

export default function GoalSetter({ onClose }: GoalSetterProps) {
  const { currentGoal, setGoal } = useProgress()
  const [problemsPerDay, setProblemsPerDay] = useState(currentGoal?.problemsPerDay || 2)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    setGoal({
      problemsPerDay,
      active: true,
      startDate: format(new Date(), 'yyyy-MM-dd')
    })
    
    onClose()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-apple overflow-hidden max-w-md w-full"
    >
      <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Set Daily Goal</h3>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5">
        <div className="mb-5">
          <label htmlFor="problemsPerDay" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Problems per day
          </label>
          <input
            type="number"
            id="problemsPerDay"
            min="1"
            max="10"
            value={problemsPerDay}
            onChange={(e) => setProblemsPerDay(Number(e.target.value))}
            className="input"
          />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Set a realistic goal you can achieve consistently.
          </p>
        </div>
        
        {currentGoal && currentGoal.active && (
          <div className="mb-5 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-md">
            <p className="text-sm text-warning-800 dark:text-warning-300">
              This will replace your current goal of {currentGoal.problemsPerDay} problems per day 
              (started on {format(new Date(currentGoal.startDate), 'MMM d, yyyy')}).
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Set Goal
          </button>
        </div>
      </form>
    </motion.div>
  )
}