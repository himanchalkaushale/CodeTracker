import { useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import { FiPlus, FiTarget, FiClock, FiCheckCircle, FiPieChart } from 'react-icons/fi'
import { format, isToday, parseISO } from 'date-fns'
import AddProblemForm from '../components/tracker/AddProblemForm'
import GoalSetter from '../components/tracker/GoalSetter'
import ProblemCard from '../components/tracker/ProblemCard'
import EditProblemForm from '../components/tracker/EditProblemForm'
import Modal from '../components/ui/Modal'
import Confirm from '../components/ui/Confirm'
import ProgressChart from '../components/stats/ProgressChart'
import { Problem } from '../types'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { getTodayProgress, currentGoal, problems, streak, dailyProgress, deleteProblem } = useProgress()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  const todayProgress = getTodayProgress()
  
  // Get recent problems (last 5 days, up to 10 problems)
  const getRecentProblems = () => {
    return problems
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
  }
  
  const recentProblems = getRecentProblems()
  
  // Calculate total problems solved
  const totalSolved = problems.filter(p => p.status === 'Solved').length
  
  // Calculate current streak percentage completion
  const getStreakCompletion = () => {
    if (!currentGoal || !currentGoal.active) return 0
    return Math.min(100, (todayProgress.problemsCompleted / currentGoal.problemsPerDay) * 100)
  }
  
  const streakCompletion = getStreakCompletion()
  
  // Calculate total time spent (last 30 days)
  const getTotalTimeSpent = () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    return dailyProgress
      .filter(p => {
        const date = parseISO(p.date)
        return date >= thirtyDaysAgo
      })
      .reduce((total, day) => total + day.timeSpent, 0)
  }
  
  const totalTimeSpent = getTotalTimeSpent()
  const totalHours = Math.floor(totalTimeSpent / 60)
  const totalMinutes = totalTimeSpent % 60
  
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
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Track your progress in competitive programming
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="btn btn-outline flex items-center"
          >
            <FiTarget className="mr-2" />
            <span>Set Goal</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2" />
            <span>Add Problem</span>
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Today's Progress */}
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Today</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {format(new Date(), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full p-2">
              <FiCheckCircle className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {todayProgress.problemsCompleted} / {currentGoal?.problemsPerDay || 0} problems
              </span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {streakCompletion.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
              <div
                className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${streakCompletion}%` }}
              />
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {todayProgress.goalCompleted 
                  ? 'Daily goal completed!'
                  : `${currentGoal?.problemsPerDay && currentGoal.problemsPerDay - todayProgress.problemsCompleted > 0 
                      ? `${currentGoal.problemsPerDay - todayProgress.problemsCompleted} more to reach your goal`
                      : 'Set a daily goal'
                    }`
                }
              </span>
            </div>
          </div>
        </div>
        
        {/* Current Streak */}
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Streak</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Current progress
              </p>
            </div>
            <div className="bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full p-2">
              <FiTarget className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-2 flex flex-col">
            <div className="flex items-end">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                {streak.current}
              </span>
              <span className="ml-1 text-lg text-neutral-700 dark:text-neutral-300">
                days
              </span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Longest streak
              </span>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {streak.longest} days
              </span>
            </div>
          </div>
        </div>
        
        {/* Total Problems */}
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Total Solved</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                All time
              </p>
            </div>
            <div className="bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full p-2">
              <FiPieChart className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-2 flex flex-col">
            <span className="text-3xl font-bold text-neutral-900 dark:text-white">
              {totalSolved}
            </span>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Total problems
              </span>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {problems.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Time Spent */}
        <div className="card p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Time Spent</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Last 30 days
              </p>
            </div>
            <div className="bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 rounded-full p-2">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          
          <div className="mt-2 flex flex-col">
            <div className="flex items-end">
              <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                {totalHours}
              </span>
              <span className="ml-1 text-lg text-neutral-700 dark:text-neutral-300">
                hrs
              </span>
              <span className="ml-2 text-3xl font-bold text-neutral-900 dark:text-white">
                {totalMinutes}
              </span>
              <span className="ml-1 text-lg text-neutral-700 dark:text-neutral-300">
                min
              </span>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Today
              </span>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                {Math.floor(todayProgress.timeSpent / 60)}h {todayProgress.timeSpent % 60}m
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Chart */}
      <div className="card p-5">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Recent Progress
        </h3>
        <ProgressChart days={14} />
      </div>
      
      {/* Recent Problems */}
      <div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
          Recent Problems
        </h3>
        
        {recentProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recentProblems.map(problem => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              No problems added yet
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
            >
              Add Your First Problem
            </button>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProblemForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>
      
      <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)}>
        <GoalSetter onClose={() => setIsGoalModalOpen(false)} />
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