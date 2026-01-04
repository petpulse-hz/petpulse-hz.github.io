"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Pet {
  id: number
  name: string
  species: string
  breed: string
  age: string
  gender: string
  weight: number
  avatar: string
}

interface ChatMessage {
  role: "user" | "assistant"
  text: string
  image?: string
}

interface AppContextType {
  apiKey: string
  setApiKey: (key: string) => void
  geminiModel: string
  setGeminiModel: (model: string) => void
  pets: Pet[]
  setPets: (pets: Pet[]) => void
  currentPetId: number
  setCurrentPetId: (id: number) => void
  chatMessages: ChatMessage[]
  setChatMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void
  modalContent: ReactNode | null
  setModalContent: (content: ReactNode | null) => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState("")
  const [geminiModel, setGeminiModelState] = useState("gemini-3-flash-preview")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setApiKeyState(localStorage.getItem("petpulse_api_key") || "")
      setGeminiModelState(localStorage.getItem("petpulse_model") || "gemini-3-flash-preview")
    }
  }, [])

  const setApiKey = (key: string) => {
    setApiKeyState(key)
    if (typeof window !== "undefined") {
      localStorage.setItem("petpulse_api_key", key)
    }
  }

  const setGeminiModel = (model: string) => {
    setGeminiModelState(model)
    if (typeof window !== "undefined") {
      localStorage.setItem("petpulse_model", model)
    }
  }

  const [pets, setPets] = useState<Pet[]>([
    { id: 1, name: "豆豆", species: "猫", breed: "英国短毛猫", age: "2岁", gender: "弟弟", weight: 4.1, avatar: "🐱" },
    { id: 2, name: "来福", species: "狗", breed: "柴犬", age: "1岁", gender: "妹妹", weight: 8.5, avatar: "🐶" },
  ])
  const [currentPetId, setCurrentPetId] = useState(1)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "您好！我是您的宠物AI医生。我已经准备好为您和您的宠物提供建议。最近它的精神状态怎么样？",
    },
  ])
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <AppContext.Provider
      value={{
        apiKey,
        setApiKey,
        geminiModel,
        setGeminiModel,
        pets,
        setPets,
        currentPetId,
        setCurrentPetId,
        chatMessages,
        setChatMessages,
        modalContent,
        setModalContent,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
