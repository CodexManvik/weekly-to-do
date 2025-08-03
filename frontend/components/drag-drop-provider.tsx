"use client"

import type React from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCenter } from "@dnd-kit/core"
import { useState } from "react"
import { useTaskContext, type Task } from "@/contexts/task-context"
import { TaskItem } from "@/components/task-item"

interface DragDropProviderProps {
  children: React.ReactNode
}

export function DragDropProvider({ children }: DragDropProviderProps) {
  const { tasks, customLists, updateTask, moveTaskToList, moveTaskToDate } = useTaskContext()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string

    // Find task in main tasks or custom lists
    let foundTask = tasks.find((task) => task.id === taskId)
    if (!foundTask) {
      for (const list of customLists) {
        foundTask = list.tasks.find((task) => task.id === taskId)
        if (foundTask) break
      }
    }

    setActiveTask(foundTask || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    // Handle dropping on a date
    if (overId.startsWith("date-")) {
      const date = overId.replace("date-", "")
      moveTaskToDate(taskId, date)
      return
    }

    // Handle dropping on a custom list
    if (overId.startsWith("list-")) {
      const listId = overId.replace("list-", "")
      moveTaskToList(taskId, listId)
      return
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay>
        {activeTask ? (
          <div className="transform rotate-3 opacity-90">
            <TaskItem task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
