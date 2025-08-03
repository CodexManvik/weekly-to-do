"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
// Use dotenv to load .env in development
// dotenv import and usage removed to fix Next.js build error

export interface Task {
  id: string
  title: string
  completed: boolean
  date: string
  time?: string
  color: "red" | "blue" | "green" | "yellow" | "purple" | "pink" | "orange" | "teal"
  recurring?: "daily" | "weekly" | "monthly"
  listId?: string
  reminder?: Date
  priority?: "low" | "medium" | "high"
}

export interface CustomList {
  id: string
  name: string
  tasks: Task[]
  color: string
}

interface TaskContextType {
  tasks: Task[]
  customLists: CustomList[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addCustomList: (name: string, color?: string) => void
  deleteCustomList: (listId: string) => void
  addTaskToList: (listId: string, task: Omit<Task, "id" | "listId">) => void
  moveTaskToDate: (taskId: string, date: string) => void
  moveTaskToList: (taskId: string, listId: string) => void
  currentWeek: Date
  setCurrentWeek: (date: Date) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [customLists, setCustomLists] = useState<CustomList[]>([])
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Load data from backend API on mount
  // Helper to get API base URL safely
  const getApiBaseUrl = () => {
    if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL
    }
    if (typeof window !== "undefined") {
      // @ts-ignore
      const url = window.NEXT_PUBLIC_API_BASE_URL || ''
      if (url) return url
    }
    // Default to localhost:5000 for development
    return 'http://localhost:5000'
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = getApiBaseUrl()
        const [tasksRes, listsRes] = await Promise.all([
          axios.get<Task[]>(`${baseUrl}/api/tasks`),
          axios.get<CustomList[]>(`${baseUrl}/api/lists`),
        ])
        setTasks(tasksRes.data)
        setCustomLists(listsRes.data)
      } catch (err) {
        // fallback: keep empty or show error
      }
    }
    fetchData()
  }, [])

  // No localStorage sync needed; backend is source of truth

  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const res = await axios.post<Task>(`${getApiBaseUrl()}/api/tasks`, task)
      setTasks((prev: Task[]) => [...prev, res.data])
    } catch (err) {}
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const res = await axios.put<Task>(`${getApiBaseUrl()}/api/tasks/${id}`, updates)
      // Always update in both tasks and all customLists
      setTasks((prev: Task[]) => {
        const exists = prev.some((task: Task) => task.id === id)
        if (exists) {
          return prev.map((task: Task) => (task.id === id ? res.data : task))
        } else if (res.data.listId === null) {
          // If the updated task is now a main task, add it
          return [...prev, res.data]
        } else {
          // If the updated task is now in a list, remove from main tasks
          return prev.filter((task: Task) => task.id !== id)
        }
      })
      setCustomLists((prev: CustomList[]) =>
        prev.map((list: CustomList) => {
          if (list.id === res.data.listId) {
            // Add or update in the correct list
            const exists = list.tasks.some((task: Task) => task.id === id)
            if (exists) {
              return {
                ...list,
                tasks: list.tasks.map((task: Task) => (task.id === id ? res.data : task)),
              }
            } else {
              return {
                ...list,
                tasks: [...list.tasks, res.data],
              }
            }
          } else {
            // Remove from other lists
            return {
              ...list,
              tasks: list.tasks.filter((task: Task) => task.id !== id),
            }
          }
        })
      )
    } catch (err) {}
  }

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${getApiBaseUrl()}/api/tasks/${id}`)
      setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== id))
      setCustomLists((prev: CustomList[]) =>
        prev.map((list: CustomList) => ({
          ...list,
          tasks: list.tasks.filter((task: Task) => task.id !== id),
        }))
      )
    } catch (err) {}
  }

  const addCustomList = async (name: string, color = "bg-gradient-to-r from-blue-500 to-purple-500") => {
    try {
      const res = await axios.post<CustomList>(`${getApiBaseUrl()}/api/lists`, { name, color })
      setCustomLists((prev: CustomList[]) => [...prev, res.data])
    } catch (err) {}
  }

  const deleteCustomList = async (listId: string) => {
    try {
      await axios.delete(`${getApiBaseUrl()}/api/lists/${listId}`)
      setCustomLists((prev: CustomList[]) => prev.filter((list: CustomList) => list.id !== listId))
    } catch (err) {}
  }

  const addTaskToList = async (listId: string, task: Omit<Task, "id" | "listId">) => {
    try {
      const res = await axios.post<Task>(`${getApiBaseUrl()}/api/lists/${listId}/tasks`, task)
      setCustomLists((prev: CustomList[]) =>
        prev.map((list: CustomList) => (list.id === listId ? { ...list, tasks: [...list.tasks, res.data] } : list))
      )
    } catch (err) {}
  }

  // Move task to a specific date (removes from any list)
  const moveTaskToDate = async (taskId: string, date: string) => {
    try {
      const res = await axios.put<Task>(`${getApiBaseUrl()}/api/tasks/${taskId}`, { date, listId: null })
      // Add to main tasks if not already there
      setTasks((prev: Task[]) => {
        const existingTask = prev.find((task: Task) => task.id === taskId)
        if (!existingTask) {
          return [...prev, res.data]
        }
        return prev.map((task: Task) => (task.id === taskId ? res.data : task))
      })
      // Remove from all custom lists
      setCustomLists((prev: CustomList[]) =>
        prev.map((list: CustomList) => ({
          ...list,
          tasks: list.tasks.filter((task: Task) => task.id !== taskId),
        }))
      )
    } catch (err) {}
  }

  const moveTaskToList = async (taskId: string, listId: string) => {
    try {
      const res = await axios.post<Task>(`${getApiBaseUrl()}/api/lists/${listId}/tasks/${taskId}/move`)
      // Remove from main tasks
      setTasks((prev: Task[]) => prev.filter((task: Task) => task.id !== taskId))
      // Update in custom lists - remove from all lists and add to target list
      setCustomLists((prev: CustomList[]) =>
        prev.map((list: CustomList) => {
          if (list.id === listId) {
            // Add to target list if not already there
            const existingTask = list.tasks.find((task: Task) => task.id === taskId)
            if (!existingTask) {
              return { ...list, tasks: [...list.tasks, res.data] }
            }
            return { ...list, tasks: list.tasks.map((task: Task) => (task.id === taskId ? res.data : task)) }
          }
          // Remove from other lists
          return { ...list, tasks: list.tasks.filter((task: Task) => task.id !== taskId) }
        })
      )
    } catch (err) {}
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        customLists,
        addTask,
        updateTask,
        deleteTask,
        addCustomList,
        deleteCustomList,
        addTaskToList,
        moveTaskToDate,
        moveTaskToList,
        currentWeek,
        setCurrentWeek,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
