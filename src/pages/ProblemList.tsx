import { useState, useMemo } from 'react'
import { useProgress } from '../context/ProgressContext'
import { FiPlus, FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { Problem, Platform, Difficulty, Category, Status } from '../types'
import ProblemCard from '../components/tracker/ProblemCard'
import AddProblemForm from '../components/tracker/AddProblemForm'
import EditProblemForm from '../components/tracker/EditProblemForm'
import Modal from '../components/ui/Modal'
import Confirm from '../components/ui/Confirm'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProblemList() {
  const { problems, deleteProblem } = useProgress()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'difficulty'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let result = [...problems]
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.notes.toLowerCase().includes(term) ||
             p.category.some(c => c.toLowerCase().includes(term))
      )
    }
    
    // Platform filter
    if (selectedPlatforms.length > 0) {
      result = result.filter(p => selectedPlatforms.includes(p.platform))
    }
    
    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      result = result.filter(p => selectedDifficulties.includes(p.difficulty))
    }
    
    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => 
        p.category.some(c => selectedCategories.includes(c))
      )
    }
    
    // Status filter
    if (selectedStatuses.length > 0) {
      result = result.filter(p => selectedStatuses.includes(p.status))
    }
    
    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      } else if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2, 'Very Hard': 3, 'Contest': 4 }
        return sortOrder === 'asc'
          ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
      }
      return 0
    })
    
    return result
  }, [problems, searchTerm, selectedPlatforms, selectedDifficulties, selectedCategories, selectedStatuses, sortBy, sortOrder])
  
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
  
  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }
  
  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }
  
  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  
  const toggleStatus = (status: Status) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }
  
  const clearFilters = () => {
    setSelectedPlatforms([])
    setSelectedDifficulties([])
    setSelectedCategories([])
    setSelectedStatuses([])
    setSearchTerm('')
  }
  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setIsConfirmDeleteOpen(true)
  }
  
  const confirmDelete = () => {
    if (deleteId) {
      deleteProblem(deleteId)
      setDeleteId(null)
    }
  }
  
  const handleEditClick = (problem: Problem) => {
    setSelectedProblem(problem)
    setIsEditModalOpen(true)
  }
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }
  
  const hasActiveFilters = selectedPlatforms.length > 0 || 
                           selectedDifficulties.length > 0 || 
                           selectedCategories.length > 0 ||
                           selectedStatuses.length > 0 ||
                           searchTerm.length > 0
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Problems</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Browse and manage your competitive programming problems
          </p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary flex items-center mt-4 md:mt-0"
        >
          <FiPlus className="mr-2" />
          <span>Add Problem</span>
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search problems, categories, or notes..."
              className="input pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`btn ${isFilterOpen || hasActiveFilters ? 'btn-primary' : 'btn-outline'} flex items-center`}
            >
              <FiFilter className="mr-2" />
              <span>Filter</span>
              {hasActiveFilters && (
                <span className="ml-2 bg-white dark:bg-neutral-700 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full px-2 py-0.5">
                  {selectedPlatforms.length + selectedDifficulties.length + selectedCategories.length + selectedStatuses.length + (searchTerm ? 1 : 0)}
                </span>
              )}
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'difficulty')}
                className="select appearance-none pr-10"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-apple-sm border border-neutral-200 dark:border-neutral-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg text-neutral-900 dark:text-white">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Clear all filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Platform Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Platform</h4>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map(platform => (
                        <button
                          key={platform}
                          onClick={() => togglePlatform(platform)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            selectedPlatforms.includes(platform)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Difficulty Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Difficulty</h4>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map(difficulty => (
                        <button
                          key={difficulty}
                          onClick={() => toggleDifficulty(difficulty)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            selectedDifficulties.includes(difficulty)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                          }`}
                        >
                          {difficulty}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(status => (
                        <button
                          key={status}
                          onClick={() => toggleStatus(status)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            selectedStatuses.includes(status)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Category</h4>
                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto scrollbar-thin">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            selectedCategories.includes(category)
                              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Problem List */}
      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {filteredProblems.map(problem => (
              <motion.div 
                key={problem.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ProblemCard
                  problem={problem}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            {problems.length === 0 
              ? "No problems added yet" 
              : "No problems match your filters"}
          </p>
          {problems.length === 0 ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              Add Your First Problem
            </button>
          ) : (
            <button
              onClick={clearFilters}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
      
      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProblemForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {selectedProblem && (
          <EditProblemForm 
            problem={selectedProblem} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </Modal>
      
      <Confirm
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Problem"
        message="Are you sure you want to delete this problem? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}