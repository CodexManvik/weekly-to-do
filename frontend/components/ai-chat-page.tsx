"use client"

import { useState } from "react"
import { Send, Bot, User, Sparkles, ArrowLeft, Zap, Target, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTaskContext } from "@/contexts/task-context"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface AIChatPageProps {
  onBackToHome: () => void
}

export function AIChatPage({ onBackToHome }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Welcome to your AI productivity assistant! 🚀 I'm here to help you break down complex tasks, organize your workflow, and boost your productivity. What would you like to accomplish today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { addTask } = useTaskContext()
  const { toast } = useToast()

  const quickPrompts = [
    {
      icon: <Target className="h-4 w-4" />,
      text: "Plan a project",
      prompt: "Help me plan a new project with clear milestones and tasks",
    },
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: "Organize my day",
      prompt: "Help me organize my daily schedule and prioritize tasks",
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Break down a goal",
      prompt: "Help me break down a big goal into smaller actionable steps",
    },
  ]

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiResponse = generateAIResponse(content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Add suggested tasks if any
      if (aiResponse.tasks.length > 0) {
        const today = new Date().toISOString().split("T")[0]
        aiResponse.tasks.forEach((taskTitle, index) => {
          setTimeout(() => {
            addTask({
              title: taskTitle,
              completed: false,
              date: today,
              color: "green",
              priority: "medium",
            })
          }, index * 300)
        })

        toast({
          title: "✨ Tasks Added!",
          description: `Added ${aiResponse.tasks.length} tasks to today's list.`,
        })
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): { message: string; tasks: string[] } => {
    const input = userInput.toLowerCase()

    if (input.includes("plan") && (input.includes("project") || input.includes("work"))) {
      return {
        message:
          "🎯 Excellent! Let me help you create a comprehensive project plan. Here are the essential tasks I've structured for you:",
        tasks: [
          "Define project scope and objectives",
          "Research and gather requirements",
          "Create detailed project timeline",
          "Identify key stakeholders and team members",
          "Set up project tracking and communication tools",
          "Plan risk management strategies",
          "Schedule regular progress reviews",
        ],
      }
    }

    if (input.includes("organize") && input.includes("day")) {
      return {
        message: "📅 Perfect! Let me help you organize your day for maximum productivity:",
        tasks: [
          "Review and prioritize today's tasks",
          "Block time for deep work sessions",
          "Schedule important meetings and calls",
          "Plan breaks and lunch time",
          "Set aside time for email and communication",
          "Prepare for tomorrow's priorities",
        ],
      }
    }

    if (input.includes("break down") && input.includes("goal")) {
      return {
        message: "🎯 Great approach! Breaking down big goals makes them much more achievable. Here's your action plan:",
        tasks: [
          "Define your specific end goal clearly",
          "Identify major milestones along the way",
          "Break each milestone into smaller tasks",
          "Set realistic deadlines for each step",
          "Create accountability measures",
          "Plan regular progress check-ins",
        ],
      }
    }

    if (input.includes("plan") && input.includes("trip")) {
      return {
        message: "🌟 I'll help you plan an amazing trip! Here are the essential tasks I've broken down for you:",
        tasks: [
          "Research destination and attractions",
          "Book flights and accommodation",
          "Create daily itinerary",
          "Pack essentials and documents",
          "Arrange transportation at destination",
          "Plan budget and expenses",
        ],
      }
    }

    if (input.includes("learn") || input.includes("study")) {
      return {
        message: "📚 Here's a structured approach to your learning goal:",
        tasks: [
          "Research learning resources and materials",
          "Create study schedule and milestones",
          "Set up learning environment",
          "Practice daily exercises and reviews",
          "Track progress and adjust plan",
          "Find study groups or mentors",
        ],
      }
    }

    if (input.includes("workout") || input.includes("fitness") || input.includes("exercise")) {
      return {
        message: "💪 Let's create a comprehensive fitness plan for you:",
        tasks: [
          "Set specific fitness goals and targets",
          "Choose workout routine and exercises",
          "Schedule exercise sessions in calendar",
          "Plan healthy meal prep and nutrition",
          "Track progress and measurements",
          "Find workout buddy or trainer",
        ],
      }
    }

    return {
      message:
        "I'd love to help you accomplish your goals! Could you provide more details about what you're working on? I can help break it down into specific, actionable tasks that you can tackle step by step. 🚀",
      tasks: [],
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-8 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBackToHome}
            className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Your intelligent productivity companion</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="h-6 w-6 text-white" />
        </div>
      </motion.div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 border-b border-slate-200/50 dark:border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Quick Start</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleSendMessage(prompt.prompt)}
                className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {prompt.icon}
                  </div>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{prompt.text}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{prompt.prompt}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-6 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-md border border-slate-200/50 dark:border-slate-600/50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {message.type === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-base leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 shadow-md border border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-8 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <Input
            placeholder="Ask me anything about productivity, planning, or task management..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="bg-white/70 dark:bg-slate-700/70 border-slate-200/50 dark:border-slate-600/50 rounded-xl text-base py-6"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            size="lg"
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
