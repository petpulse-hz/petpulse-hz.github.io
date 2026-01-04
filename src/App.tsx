"use client"

import { useState } from "react"
import Header from "./components/Header"
import BottomNav from "./components/BottomNav"
import Modal from "./components/Modal"
import AskTab from "./components/tabs/AskTab"
import HealthTab from "./components/tabs/HealthTab"
import KnowledgeTab from "./components/tabs/KnowledgeTab"
import ShopTab from "./components/tabs/ShopTab"
import MeTab from "./components/tabs/MeTab"
import { AppProvider } from "./context/AppContext"
import { CccProvider } from "./providers/CccProvider"

type TabType = "ask" | "health" | "knowledge" | "shop" | "me"

function App() {
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
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const net = (search.get('net') || 'testnet').toLowerCase();
  const network = net === 'mainnet' ? 'mainnet' : 'testnet';

  return (
    <CccProvider network={network as 'mainnet' | 'testnet'}>
      <AppProvider>
        <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl relative overflow-hidden">
          <Header pageTitle={getPageTitle()} />

          <main className="flex-1 overflow-y-auto no-scrollbar pb-24">{renderTab()}</main>

          <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

          <Modal />
        </div>
      </AppProvider>
    </CccProvider>
  )
}

export default App
