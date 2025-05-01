import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Problem, DailyProgress, Goal, Streak } from '../types'
import { format, subDays, isToday, parseISO, addDays, isBefore } from 'date-fns'

interface ProgressContextType {
  problems: Problem[]
  dailyProgress: DailyProgress[]
  currentGoal: Goal | null
  streak: Streak
  addProblem: (problem: Omit<Problem, 'id'>) => void
  updateProblem: (id: string, problem: Partial<Problem>) => void
  deleteProblem: (id: string) => void
  setGoal: (goal: Omit<Goal, 'id'>) => void
  getTodayProgress: () => DailyProgress
  getCompletionRate: () => number
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const STORAGE_KEY = 'cp-tracker-data'

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [streak, setStreak] = useState<Streak>({
    current: 0,
    longest: 0,
    history: []
  })

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const { problems, dailyProgress, currentGoal, streak } = JSON.parse(savedData)
        setProblems(problems || [])
        setDailyProgress(dailyProgress || [])
        setCurrentGoal(currentGoal || null)
        setStreak(streak || { current: 0, longest: 0, history: [] })
      } catch (error) {
        console.error('Error parsing saved data:', error)
      }
    }
    
    // Initialize today's progress if it doesn't exist
    const today = format(new Date(), 'yyyy-MM-dd')
    if (!dailyProgress.some(p => p.date === today)) {
      setDailyProgress(prev => [
        ...prev,
        {
          date: today,
          problemsCompleted: 0,
          goalCompleted: false,
          problems: [],
          timeSpent: 0
        }
      ])
    }
    
    // Create default goal if none exists
    if (!currentGoal) {
      setCurrentGoal({
        id: crypto.randomUUID(),
        problemsPerDay: 2,
        active: true,
        startDate: today
      })
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      problems,
      dailyProgress,
      currentGoal,
      streak
    }))
  }, [problems, dailyProgress, currentGoal, streak])

  // Update streak information
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
    
    // Check if we need to update streak information
    const todayProgress = dailyProgress.find(p => p.date === today)
    const yesterdayProgress = dailyProgress.find(p => p.date === yesterday)
    
    if (!todayProgress) return
    
    const todayCompleted = todayProgress.goalCompleted
    
    let newStreak = { ...streak }
    
    // Check if today's data is already in history
    const todayInHistory = newStreak.history.some(h => h.date === today)
    
    if (!todayInHistory) {
      // Add today to streak history
      newStreak.history = [
        ...newStreak.history,
        { date: today, completed: todayCompleted }
      ]
      
      // Update current streak
      if (todayCompleted) {
        if (yesterdayProgress?.goalCompleted) {
          newStreak.current += 1
        } else {
          newStreak.current = 1
        }
      } else {
        newStreak.current = 0
      }
      
      // Update longest streak
      if (newStreak.current > newStreak.longest) {
        newStreak.longest = newStreak.current
      }
      
      setStreak(newStreak)
    } else {
      // Update today's completion status if it changed
      const existingIndex = newStreak.history.findIndex(h => h.date === today)
      if (existingIndex >= 0 && newStreak.history[existingIndex].completed !== todayCompleted) {
        newStreak.history[existingIndex].completed = todayCompleted
        
        // Recalculate current streak
        if (todayCompleted) {
          if (yesterdayProgress?.goalCompleted) {
            newStreak.current = calculateCurrentStreak(newStreak.history)
          } else {
            newStreak.current = 1
          }
        } else {
          newStreak.current = 0
        }
        
        // Update longest streak
        if (newStreak.current > newStreak.longest) {
          newStreak.longest = newStreak.current
        }
        
        setStreak(newStreak)
      }
    }
  }, [dailyProgress])

  // Helper function to calculate current streak
  const calculateCurrentStreak = (history: Streak['history']) => {
    let count = 0
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].completed) {
        count++
      } else {
        break
      }
    }
    return count
  }

  // Add a new problem
  const addProblem = (problem: Omit<Problem, 'id'>) => {
    const newProblem: Problem = {
      ...problem,
      id: crypto.randomUUID()
    }
    
    setProblems(prev => [...prev, newProblem])
    
    // Update daily progress
    const problemDate = problem.date
    const dayProgress = dailyProgress.find(p => p.date === problemDate)
    
    if (dayProgress) {
      const updatedProgress = {
        ...dayProgress,
        problems: [...dayProgress.problems, newProblem],
        problemsCompleted: problem.status === 'Solved' 
          ? dayProgress.problemsCompleted + 1 
          : dayProgress.problemsCompleted,
        timeSpent: dayProgress.timeSpent + (problem.timeSpent || 0)
      }
      
      // Check if goal is complete
      if (currentGoal && problem.status === 'Solved') {
        updatedProgress.goalCompleted = updatedProgress.problemsCompleted >= currentGoal.problemsPerDay
      }
      
      setDailyProgress(prev => 
        prev.map(p => p.date === problemDate ? updatedProgress : p)
      )
    } else {
      // Create new daily progress entry
      const newProgress: DailyProgress = {
        date: problemDate,
        problems: [newProblem],
        problemsCompleted: problem.status === 'Solved' ? 1 : 0,
        goalCompleted: problem.status === 'Solved' && currentGoal 
          ? 1 >= currentGoal.problemsPerDay 
          : false,
        timeSpent: problem.timeSpent || 0
      }
      
      setDailyProgress(prev => [...prev, newProgress])
    }
  }

  // Update an existing problem
  const updateProblem = (id: string, updates: Partial<Problem>) => {
    const problem = problems.find(p => p.id === id)
    if (!problem) return
    
    const updatedProblem = { ...problem, ...updates }
    
    setProblems(prev => 
      prev.map(p => p.id === id ? updatedProblem : p)
    )
    
    // Update daily progress
    const oldDate = problem.date
    const newDate = updates.date || oldDate
    const oldStatus = problem.status
    const newStatus = updates.status || oldStatus
    
    // If problem date changed, update both old and new date's progress
    if (oldDate !== newDate) {
      // Remove from old date
      const oldDayProgress = dailyProgress.find(p => p.date === oldDate)
      if (oldDayProgress) {
        const updatedOldProgress = {
          ...oldDayProgress,
          problems: oldDayProgress.problems.filter(p => p.id !== id),
          problemsCompleted: oldStatus === 'Solved' ? Math.max(0, oldDayProgress.problemsCompleted - 1) : oldDayProgress.problemsCompleted,
          timeSpent: Math.max(0, oldDayProgress.timeSpent - (problem.timeSpent || 0))
        }
        
        // Update goal completion status
        if (currentGoal && oldStatus === 'Solved') {
          updatedOldProgress.goalCompleted = updatedOldProgress.problemsCompleted >= currentGoal.problemsPerDay
        }
        
        setDailyProgress(prev => 
          prev.map(p => p.date === oldDate ? updatedOldProgress : p)
        )
      }
      
      // Add to new date
      const newDayProgress = dailyProgress.find(p => p.date === newDate)
      if (newDayProgress) {
        const updatedNewProgress = {
          ...newDayProgress,
          problems: [...newDayProgress.problems.filter(p => p.id !== id), updatedProblem],
          problemsCompleted: newStatus === 'Solved' ? newDayProgress.problemsCompleted + 1 : newDayProgress.problemsCompleted,
          timeSpent: newDayProgress.timeSpent + (updates.timeSpent || problem.timeSpent || 0)
        }
        
        // Update goal completion status
        if (currentGoal && newStatus === 'Solved') {
          updatedNewProgress.goalCompleted = updatedNewProgress.problemsCompleted >= currentGoal.problemsPerDay
        }
        
        setDailyProgress(prev => 
          prev.map(p => p.date === newDate ? updatedNewProgress : p)
        )
      } else {
        // Create new daily progress entry
        const newProgress: DailyProgress = {
          date: newDate,
          problems: [updatedProblem],
          problemsCompleted: newStatus === 'Solved' ? 1 : 0,
          goalCompleted: newStatus === 'Solved' && currentGoal ? 1 >= currentGoal.problemsPerDay : false,
          timeSpent: updates.timeSpent || problem.timeSpent || 0
        }
        
        setDailyProgress(prev => [...prev, newProgress])
      }
    } else {
      // Only status or other properties changed
      const dayProgress = dailyProgress.find(p => p.date === oldDate)
      if (dayProgress) {
        let problemsCompleted = dayProgress.problemsCompleted
        
        // Update completion count if status changed
        if (oldStatus !== newStatus) {
          if (oldStatus === 'Solved' && newStatus !== 'Solved') {
            problemsCompleted = Math.max(0, problemsCompleted - 1)
          } else if (oldStatus !== 'Solved' && newStatus === 'Solved') {
            problemsCompleted = problemsCompleted + 1
          }
        }
        
        // Calculate new time spent
        const oldTime = problem.timeSpent || 0
        const newTime = updates.timeSpent !== undefined ? updates.timeSpent : oldTime
        const timeSpentDiff = newTime - oldTime
        
        const updatedProgress = {
          ...dayProgress,
          problems: dayProgress.problems.map(p => p.id === id ? updatedProblem : p),
          problemsCompleted,
          timeSpent: Math.max(0, dayProgress.timeSpent + timeSpentDiff)
        }
        
        // Update goal completion status
        if (currentGoal) {
          updatedProgress.goalCompleted = updatedProgress.problemsCompleted >= currentGoal.problemsPerDay
        }
        
        setDailyProgress(prev => 
          prev.map(p => p.date === oldDate ? updatedProgress : p)
        )
      }
    }
  }

  // Delete a problem
  const deleteProblem = (id: string) => {
    const problem = problems.find(p => p.id === id)
    if (!problem) return
    
    setProblems(prev => prev.filter(p => p.id !== id))
    
    // Update daily progress
    const date = problem.date
    const dayProgress = dailyProgress.find(p => p.date === date)
    
    if (dayProgress) {
      const updatedProgress = {
        ...dayProgress,
        problems: dayProgress.problems.filter(p => p.id !== id),
        problemsCompleted: problem.status === 'Solved' 
          ? Math.max(0, dayProgress.problemsCompleted - 1) 
          : dayProgress.problemsCompleted,
        timeSpent: Math.max(0, dayProgress.timeSpent - (problem.timeSpent || 0))
      }
      
      // Update goal completion status
      if (currentGoal && problem.status === 'Solved') {
        updatedProgress.goalCompleted = updatedProgress.problemsCompleted >= currentGoal.problemsPerDay
      }
      
      setDailyProgress(prev => 
        prev.map(p => p.date === date ? updatedProgress : p)
      )
    }
  }

  // Set a new goal
  const setGoal = (goal: Omit<Goal, 'id'>) => {
    // If there's an existing active goal, deactivate it
    if (currentGoal && currentGoal.active) {
      const updatedCurrentGoal = {
        ...currentGoal,
        active: false,
        endDate: format(new Date(), 'yyyy-MM-dd')
      }
      setCurrentGoal(updatedCurrentGoal)
    }
    
    // Create new goal
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID()
    }
    setCurrentGoal(newGoal)
    
    // Update today's goal completion status
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayProgress = dailyProgress.find(p => p.date === today)
    
    if (todayProgress) {
      const updatedProgress = {
        ...todayProgress,
        goalCompleted: todayProgress.problemsCompleted >= newGoal.problemsPerDay
      }
      
      setDailyProgress(prev => 
        prev.map(p => p.date === today ? updatedProgress : p)
      )
    }
  }

  // Get today's progress
  const getTodayProgress = (): DailyProgress => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const todayProgress = dailyProgress.find(p => p.date === today)
    
    if (todayProgress) {
      return todayProgress
    }
    
    // Create and return empty progress for today
    const emptyProgress: DailyProgress = {
      date: today,
      problemsCompleted: 0,
      goalCompleted: false,
      problems: [],
      timeSpent: 0
    }
    
    setDailyProgress(prev => [...prev, emptyProgress])
    return emptyProgress
  }

  // Calculate completion rate
  const getCompletionRate = (): number => {
    if (!currentGoal || !currentGoal.active) return 0
    
    const today = new Date()
    const startDate = parseISO(currentGoal.startDate)
    
    // If goal hasn't started yet, return 0
    if (isBefore(today, startDate)) return 0
    
    // Calculate days since goal started (including today)
    let dayCount = 0
    let currentDate = startDate
    
    while (!isBefore(today, currentDate)) {
      const dateString = format(currentDate, 'yyyy-MM-dd')
      const progress = dailyProgress.find(p => p.date === dateString)
      
      if (progress) {
        dayCount++
      }
      
      currentDate = addDays(currentDate, 1)
    }
    
    if (dayCount === 0) return 0
    
    // Calculate successful days
    const successfulDays = dailyProgress
      .filter(p => {
        const date = parseISO(p.date)
        return (
          !isBefore(date, startDate) && 
          !isBefore(today, date) && 
          p.goalCompleted
        )
      })
      .length
    
    return (successfulDays / dayCount) * 100
  }

  return (
    <ProgressContext.Provider value={{
      problems,
      dailyProgress,
      currentGoal,
      streak,
      addProblem,
      updateProblem,
      deleteProblem,
      setGoal,
      getTodayProgress,
      getCompletionRate
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}