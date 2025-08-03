"use client"

import { Home, Calendar, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIChat } from "@/components/ai-chat"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
  isAIChatOpen: boolean
  setIsAIChatOpen: (open: boolean) => void
  onCalendarClick: () => void
  onHomeClick: () => void
  onAIChatPageClick: () => void
}

export function Sidebar({
  isAIChatOpen,
  setIsAIChatOpen,
  onCalendarClick,
  onHomeClick,
  onAIChatPageClick,
}: SidebarProps) {
  return (
    <>
      <div className="w-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col items-center py-4 space-y-4 shadow-lg">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
        </div>

        <nav className="flex flex-col space-y-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
            onClick={onHomeClick}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
            onClick={onCalendarClick}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
            onClick={onAIChatPageClick}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </nav>

        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </div>

      <AnimatePresence>
        {isAIChatOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAIChatOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AIChat />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
