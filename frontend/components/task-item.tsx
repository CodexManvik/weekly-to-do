"use client"

import type React from "react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Clock, Repeat, AlertCircle } from "lucide-react"
import { useTaskContext, type Task } from "@/contexts/task-context"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"
import { motion } from "framer-motion"

interface TaskItemProps {
  task: Task
  isDragging?: boolean
}

const colorClasses = {
  red: "border-l-red-500 bg-red-50/50 dark:bg-red-900/20",
  blue: "border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/20",
  green: "border-l-green-500 bg-green-50/50 dark:bg-green-900/20",
  yellow: "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20",
  purple: "border-l-purple-500 bg-purple-50/50 dark:bg-purple-900/20",
  pink: "border-l-pink-500 bg-pink-50/50 dark:bg-pink-900/20",
  orange: "border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/20",
  teal: "border-l-teal-500 bg-teal-50/50 dark:bg-teal-900/20",
}

const priorityIcons = {
  high: <AlertCircle className="h-3 w-3 text-red-500" />,
  medium: <AlertCircle className="h-3 w-3 text-yellow-500" />,
  low: <AlertCircle className="h-3 w-3 text-green-500" />,
}

export function TaskItem({ task, isDragging = false }: TaskItemProps) {
  const { updateTask, deleteTask } = useTaskContext()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dragActive,
  } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed })
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() })
    }
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group flex items-start space-x-3 p-4 rounded-xl border-l-4 transition-all duration-200 cursor-grab active:cursor-grabbing backdrop-blur-sm",
        colorClasses[task.color],
        task.completed && "opacity-60",
        dragActive && "shadow-2xl z-50 rotate-2",
        isDragging && "shadow-2xl opacity-90",
        "hover:shadow-md border border-white/20 dark:border-slate-700/50",
      )}
    >
      <div 
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
        />
      </div>

      <div 
        className="flex-1 min-w-0"
        {...listeners}
        {...attributes}
      >
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyPress}
            className="w-full bg-transparent border-none outline-none text-sm font-medium"
            autoFocus
          />
        ) : (
          <p
            className={cn(
              "text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-200",
              task.completed && "line-through text-slate-400 dark:text-slate-500",
            )}
            onDoubleClick={handleDoubleClick}
          >
            {task.title}
          </p>
        )}

        <div className="flex items-center space-x-3 mt-2">
          {task.time && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
              <Clock className="h-3 w-3" />
              <span>{task.time}</span>
            </div>
          )}
          {task.recurring && (
            <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
              <Repeat className="h-3 w-3" />
              <span>{task.recurring}</span>
            </div>
          )}
          {task.priority && (
            <div className="flex items-center space-x-1 text-xs bg-white/50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
              {priorityIcons[task.priority]}
              <span className="text-slate-500 dark:text-slate-400">{task.priority}</span>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
