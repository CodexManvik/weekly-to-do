"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Palette, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskItem } from "@/components/task-item"
import { useTaskContext } from "@/contexts/task-context"
import { useDroppable } from "@dnd-kit/core"
import { motion } from "framer-motion"

function DroppableList({ listId, children }: { listId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-${listId}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-300 ${
        isOver ? "ring-2 ring-purple-400 ring-opacity-50 bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl" : ""
      }`}
    >
      {children}
    </div>
  )
}

export function CustomLists() {
  const { customLists, addCustomList, addTaskToList, deleteCustomList } = useTaskContext()
  const [newListName, setNewListName] = useState("")
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [newTaskInputs, setNewTaskInputs] = useState<Record<string, string>>({})

  const gradients = [
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
  ]

  const handleAddList = () => {
    if (newListName.trim()) {
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
      addCustomList(newListName.trim(), randomGradient)
      setNewListName("")
      setShowNewListInput(false)
    }
  }

  const handleAddTaskToList = (listId: string) => {
    const taskTitle = newTaskInputs[listId]
    if (taskTitle?.trim()) {
      addTaskToList(listId, {
        title: taskTitle.trim(),
        completed: false,
        date: "",
        color: "blue",
        priority: "medium",
      })
      setNewTaskInputs((prev) => ({ ...prev, [listId]: "" }))
    }
  }

  const handleTaskInputChange = (listId: string, value: string) => {
    setNewTaskInputs((prev) => ({ ...prev, [listId]: value }))
  }

  return (
    <div className="px-8 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {customLists.map((list, index) => (
          <motion.div
            key={list.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <DroppableList listId={list.id}>
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${list.color}`}></div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{list.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600"
                      onClick={() => deleteCustomList(list.id)}
                      title="Delete list"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => {
                        const input = newTaskInputs[list.id] || ""
                        if (input.trim()) {
                          handleAddTaskToList(list.id)
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {list.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + taskIndex * 0.05 }}
                    >
                      <TaskItem task={task} />
                    </motion.div>
                  ))}
                  {list.tasks.length === 0 && (
                    <div className="text-center py-6 text-slate-400 dark:text-slate-500">
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  )}
                </div>

                <Input
                  placeholder="Add new task..."
                  value={newTaskInputs[list.id] || ""}
                  onChange={(e) => handleTaskInputChange(list.id, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddTaskToList(list.id)
                    }
                  }}
                  className="text-sm bg-white/50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600/50 rounded-xl"
                />
              </div>
            </DroppableList>
          </motion.div>
        ))}

        {/* Add new list card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + customLists.length * 0.1 }}
          className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed border-slate-300/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {showNewListInput ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Palette className="h-5 w-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">New List</span>
              </div>
              <Input
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddList()
                  } else if (e.key === "Escape") {
                    setShowNewListInput(false)
                    setNewListName("")
                  }
                }}
                className="bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl"
                autoFocus
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleAddList} className="rounded-lg">
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowNewListInput(false)
                    setNewListName("")
                  }}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full h-full min-h-[120px] border-dashed hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl"
              onClick={() => setShowNewListInput(true)}
            >
              <div className="text-center">
                <Plus className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Add New List</p>
              </div>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
