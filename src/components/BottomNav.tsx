"use client"

import { MessageSquare, HeartPulse, BookOpen, ShoppingBag, User } from "lucide-react"

interface BottomNavProps {
  currentTab: string
  onTabChange: (tab: "ask" | "health" | "knowledge" | "shop" | "me") => void
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "ask", icon: MessageSquare, label: "问诊" },
    { id: "health", icon: HeartPulse, label: "健康" },
    { id: "knowledge", icon: BookOpen, label: "科普" },
    { id: "shop", icon: ShoppingBag, label: "商城" },
    { id: "me", icon: User, label: "我的" },
  ]

  return (
    <nav className="bg-white border-t border-[#F1E0D6] pb-6 pt-2 px-6 flex justify-between items-center z-50 fixed bottom-0 w-full max-w-2xl">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id as any)}
          className={`flex flex-col items-center gap-1 ${currentTab === id ? "text-[#D2B48C]" : "text-[#5D4037]"}`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-bold">{label}</span>
        </button>
      ))}
    </nav>
  )
}
