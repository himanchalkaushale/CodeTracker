export interface Problem {
  id: string
  name: string
  link: string
  platform: Platform
  difficulty: Difficulty
  category: Category[]
  notes: string
  status: Status
  date: string
  timeSpent: number // in minutes
}

export interface DailyProgress {
  date: string
  problemsCompleted: number
  goalCompleted: boolean
  problems: Problem[]
  timeSpent: number // in minutes
}

export interface Goal {
  id: string
  problemsPerDay: number
  active: boolean
  startDate: string
  endDate?: string
}

export interface User {
  name: string
  email: string
  preferences: {
    goalProblemsPerDay: number
    defaultPlatform: Platform
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

export type Platform = 
  | 'LeetCode'
  | 'CodeForces'
  | 'HackerRank'
  | 'AtCoder'
  | 'CodeChef'
  | 'TopCoder'
  | 'SPOJ'
  | 'Other'

export type Difficulty =
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Very Hard'
  | 'Contest'

export type Category = 
  | 'Array'
  | 'String'
  | 'Hash Table'
  | 'Math'
  | 'Dynamic Programming'
  | 'Sorting'
  | 'Greedy'
  | 'Depth-First Search'
  | 'Breadth-First Search'
  | 'Binary Search'
  | 'Tree'
  | 'Graph'
  | 'Heap'
  | 'Stack'
  | 'Queue'
  | 'Linked List'
  | 'Union Find'
  | 'Recursion'
  | 'Sliding Window'
  | 'Divide and Conquer'
  | 'Bit Manipulation'
  | 'Trie'
  | 'Binary Tree'
  | 'Other'

export type Status =
  | 'Solved'
  | 'Partially Solved'
  | 'Attempted'
  | 'To Solve'
  | 'Reviewing'

export interface Streak {
  current: number
  longest: number
  history: {
    date: string
    completed: boolean
  }[]
}