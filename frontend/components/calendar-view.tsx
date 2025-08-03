"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTaskContext } from "@/contexts/task-context"
import { motion, AnimatePresence } from "framer-motion"
import { TaskItem } from "@/components/task-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarViewProps {
  onBackToWeek: () => void
}

export function CalendarView({ onBackToWeek }: CalendarViewProps) {
  const { tasks } = useTaskContext()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const days = getDaysInMonth(currentDate)
  const selectedTasks = selectedDate ? tasks.filter((task) => task.date === selectedDate) : []

  return (
    <div className="flex-1 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBackToWeek}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {formatMonthYear(currentDate)}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Monthly calendar view</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("prev")}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth("next")}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-8">
        {/* Calendar Grid */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" />
                }

                const dayTasks = getTasksForDate(day)
                const dateString = day.toISOString().split("T")[0]
                const isSelected = selectedDate === dateString
                const isToday = dateString === new Date().toISOString().split("T")[0]

                return (
                  <motion.button
                    key={day.getDate()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(dateString)}
                    className={`aspect-square p-2 rounded-xl border transition-all duration-200 relative ${
                      isSelected
                        ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                        : isToday
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="text-sm font-medium">{day.getDate()}</div>
                    {dayTasks.length > 0 && (
                      <div
                        className={`absolute bottom-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-blue-500 text-white"
                        }`}
                      >
                        {dayTasks.length}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Selected Day Tasks */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-96"
            >
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg h-fit">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {formatSelectedDate(selectedDate)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Close
                  </Button>
                </div>

                <ScrollArea className="max-h-96">
                  <div className="space-y-3">
                    {selectedTasks.length > 0 ? (
                      selectedTasks.map((task) => <TaskItem key={task.id} task={task} />)
                    ) : (
                      <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        <p className="text-sm">No tasks for this day</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
