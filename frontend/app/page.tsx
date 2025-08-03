"use client"
import { WeeklyView } from "@/components/weekly-view"
import { Sidebar } from "@/components/sidebar"
import { CustomLists } from "@/components/custom-lists"
import { ThemeProvider } from "@/components/theme-provider"
import { TaskProvider } from "@/contexts/task-context"
import { Toaster } from "@/components/ui/toaster"
import { DragDropProvider } from "@/components/drag-drop-provider"
import { AIFloatingButton } from "@/components/ai-floating-button"
import { useState } from "react"
import { CalendarView } from "@/components/calendar-view"
import { AIChatPage } from "@/components/ai-chat-page"
import { AIChat } from "@/components/ai-chat"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type ViewType = "home" | "calendar" | "ai-chat"

export default function Home() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>("home")

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    setIsAIChatOpen(false) // Close any open AI chat panel when switching views
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TaskProvider>
        <DragDropProvider>
          <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <Sidebar
              isAIChatOpen={isAIChatOpen}
              setIsAIChatOpen={setIsAIChatOpen}
              onCalendarClick={() => handleViewChange("calendar")}
              onHomeClick={() => handleViewChange("home")}
              onAIChatPageClick={() => handleViewChange("ai-chat")}
            />
            <main className="flex-1 flex flex-col overflow-auto h-full">
              <div className="flex-1 flex flex-col">
                {currentView === "home" && (
                  <>
                    <WeeklyView />
                    <CustomLists />
                  </>
                )}
                {currentView === "calendar" && <CalendarView onBackToWeek={() => handleViewChange("home")} />}
                {currentView === "ai-chat" && <AIChatPage onBackToHome={() => handleViewChange("home")} />}
              </div>
            </main>
            {currentView === "home" && <AIFloatingButton onClick={() => {
              console.log('Setting AI chat open to true')
              setIsAIChatOpen(true)
            }} />}
            
            {/* AI Chat Panel */}
            <AnimatePresence>
              {isAIChatOpen && (
                console.log('Rendering AI chat panel, isAIChatOpen:', isAIChatOpen),
                <motion.div
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 shadow-2xl z-40"
                >
                  <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">AI Assistant</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsAIChatOpen(false)}
                      className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="h-full flex flex-col">
                    <AIChat />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <Toaster />
          </div>
        </DragDropProvider>
      </TaskProvider>
    </ThemeProvider>
  )
}
