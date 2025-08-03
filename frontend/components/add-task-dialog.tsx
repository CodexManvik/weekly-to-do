"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTaskContext, type Task } from "@/contexts/task-context"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: string
}

export function AddTaskDialog({ open, onOpenChange, selectedDate }: AddTaskDialogProps) {
  const { addTask } = useTaskContext()
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [color, setColor] = useState<Task["color"]>("blue")
  const [recurring, setRecurring] = useState<Task["recurring"] | "none">("none")
  const [priority, setPriority] = useState<Task["priority"]>("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title: title.trim(),
      completed: false,
      date: selectedDate,
      time: time || undefined,
      color,
      recurring: recurring !== "none" ? recurring : undefined,
      priority,
    })

    // Reset form
    setTitle("")
    setTime("")
    setColor("blue")
    setRecurring("none")
    setPriority("medium")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Add New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="mt-2 bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Time (optional)
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="priority" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Priority
              </Label>
              <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
                <SelectTrigger className="mt-2 bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="color" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Color
            </Label>
            <Select value={color} onValueChange={(value: Task["color"]) => setColor(value)}>
              <SelectTrigger className="mt-2 bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="teal">Teal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="recurring" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Recurring (optional)
            </Label>
            <Select value={recurring} onValueChange={(value: Task["recurring"] | "none") => setRecurring(value)}>
              <SelectTrigger className="mt-2 bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl">
                <SelectValue placeholder="Select recurring option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
