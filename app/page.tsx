"use client"

import { useState } from "react"
import Header from "@/src/components/Header"
import BottomNav from "@/src/components/BottomNav"
import Modal from "@/src/components/Modal"
import AskTab from "@/src/components/tabs/AskTab"
import HealthTab from "@/src/components/tabs/HealthTab"
import KnowledgeTab from "@/src/components/tabs/KnowledgeTab"
import ShopTab from "@/src/components/tabs/ShopTab"
import MeTab from "@/src/components/tabs/MeTab"
import { AppProvider } from "@/src/context/AppContext"

type TabType = "ask" | "health" | "knowledge" | "shop" | "me"

export default function Page() {
  const [currentTab, setCurrentTab] = useState<TabType>("ask")

  const renderTab = () => {
    switch (currentTab) {
      case "ask":
        return <AskTab />
      case "health":
        return <HealthTab />
      case "knowledge":
        return <KnowledgeTab />
      case "shop":
        return <ShopTab />
      case "me":
        return <MeTab />
      default:
        return <AskTab />
    }
  }

  const getPageTitle = () => {
    const titles = {
      ask: "问诊",
      health: "健康",
      knowledge: "科普",
      shop: "商城",
      me: "我的",
    }
    return titles[currentTab]
  }

  return (
    <AppProvider>
      <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl relative overflow-hidden">
        <Header pageTitle={getPageTitle()} />

        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">{renderTab()}</main>

        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

        <Modal />
      </div>
    </AppProvider>
  )
}
