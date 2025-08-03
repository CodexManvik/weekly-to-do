"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl" />
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-12 h-12 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
      )}
    </Button>
  )
}
