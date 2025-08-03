"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskItem } from "@/components/task-item"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { useTaskContext } from "@/contexts/task-context"
import { useDroppable } from "@dnd-kit/core"
import { motion } from "framer-motion"

const DAYS = ["Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]

function DroppableDay({ date, children }: { date: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `date-${date}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 min-h-[320px] shadow-lg hover:shadow-xl transition-all duration-300 ${
        isOver ? "ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/50 dark:bg-blue-900/20" : ""
      }`}
    >
      {children}
    </div>
  )
}

export function WeeklyView() {
  const { tasks, currentWeek, setCurrentWeek } = useTaskContext()
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")

  const getWeekDates = (startDate: Date) => {
    const dates = []
    const start = new Date(startDate)
    // Adjust to start from Friday
    const dayOfWeek = start.getDay()
    const diff = dayOfWeek === 0 ? -2 : 5 - dayOfWeek // Friday is day 5
    start.setDate(start.getDate() + diff)

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(currentWeek)

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return tasks.filter((task) => task.date === dateString)
  }

  const handleAddTask = (date: Date) => {
    setSelectedDate(date.toISOString().split("T")[0])
    setShowAddTask(true)
  }

  return (
    <div className="flex-1 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            WeekToDo Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Organize your week with style</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-7 gap-6 mb-8"
      >
        {DAYS.map((day, index) => {
          const date = weekDates[index]
          const dayTasks = getTasksForDate(date)
          const dateString = date.toISOString().split("T")[0]

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <DroppableDay date={dateString}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{day}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(date)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700"
                    onClick={() => handleAddTask(date)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {dayTasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + taskIndex * 0.05 }}
                    >
                      <TaskItem task={task} />
                    </motion.div>
                  ))}
                  {dayTasks.length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                      <p className="text-sm">Drop tasks here</p>
                    </div>
                  )}
                </div>
              </DroppableDay>
            </motion.div>
          )
        })}
      </motion.div>

      <AddTaskDialog open={showAddTask} onOpenChange={setShowAddTask} selectedDate={selectedDate} />
    </div>
  )
}
