import { useState, useEffect } from 'react'
import { useProgress } from '../../context/ProgressContext'
import { Problem, Platform, Difficulty, Category, Status } from '../../types'
import { FiX, FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface EditProblemFormProps {
  problem: Problem
  onClose: () => void
}

export default function EditProblemForm({ problem, onClose }: EditProblemFormProps) {
  const { updateProblem } = useProgress()
  const [formData, setFormData] = useState<Problem>({...problem})
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  useEffect(() => {
    setFormData({...problem})
  }, [problem])
  
  const platforms: Platform[] = [
    'LeetCode',
    'CodeForces',
    'HackerRank',
    'AtCoder',
    'CodeChef', 
    'TopCoder',
    'SPOJ',
    'Other'
  ]
  
  const difficulties: Difficulty[] = [
    'Easy',
    'Medium',
    'Hard',
    'Very Hard',
    'Contest'
  ]
  
  const categories: Category[] = [
    'Array',
    'String',
    'Hash Table',
    'Math',
    'Dynamic Programming',
    'Sorting',
    'Greedy',
    'Depth-First Search',
    'Breadth-First Search',
    'Binary Search',
    'Tree',
    'Graph',
    'Heap',
    'Stack',
    'Queue',
    'Linked List',
    'Union Find',
    'Recursion',
    'Sliding Window',
    'Divide and Conquer',
    'Bit Manipulation',
    'Trie',
    'Binary Tree',
    'Other'
  ]
  
  const statuses: Status[] = [
    'Solved',
    'Partially Solved',
    'Attempted',
    'To Solve',
    'Reviewing'
  ]
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  const handleCategoryChange = (category: Category) => {
    setFormData(prev => {
      const currentCategories = [...prev.category]
      if (currentCategories.includes(category)) {
        return { ...prev, category: currentCategories.filter(c => c !== category) }
      } else {
        return { ...prev, category: [...currentCategories, category] }
      }
    })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Problem name is required'
    }
    if (formData.link && !isValidURL(formData.link)) {
      newErrors.link = 'Please enter a valid URL'
    }
    if (formData.category.length === 0) {
      newErrors.category = 'Select at least one category'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Update the problem
    updateProblem(problem.id, formData)
    onClose()
  }
  
  const isValidURL = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-apple overflow-hidden max-w-2xl w-full"
    >
      <div className="flex justify-between items-center p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Edit Problem</h3>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Problem Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Problem Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="E.g., Two Sum"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error-500">{errors.name}</p>
            )}
          </div>
          
          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Problem Link
            </label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className={`input ${errors.link ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="E.g., https://leetcode.com/problems/two-sum/"
            />
            {errors.link && (
              <p className="mt-1 text-sm text-error-500">{errors.link}</p>
            )}
          </div>
          
          {/* Platform and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Platform
              </label>
              <div className="relative">
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="select appearance-none"
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Difficulty
              </label>
              <div className="relative">
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="select appearance-none"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Categories*
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  type="button"
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                    formData.category.includes(category)
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-error-500">{errors.category}</p>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select appearance-none"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="timeSpent" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Time Spent (minutes)
              </label>
              <input
                type="number"
                id="timeSpent"
                name="timeSpent"
                value={formData.timeSpent}
                onChange={handleChange}
                min="0"
                className="input"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input"
              placeholder="Add your notes about the solution, approach, or things to remember..."
            />
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
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
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}