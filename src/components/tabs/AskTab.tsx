"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, ImageIcon } from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import { callAI, callAIWithParts } from "../../utils/ai"

export default function AskTab() {
  const { chatMessages, setChatMessages, pets, currentPetId, apiKey, geminiModel } = useAppContext()
  const [inputText, setInputText] = useState("")
  const [greeting, setGreeting] = useState('"主人，今天也要开开心心哒~"')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const petInfo = pets.find((p) => p.id === currentPetId)

  useEffect(() => {
    if (petInfo && apiKey) {
      callAI(
        `请以宠物${petInfo.name}的视角，给主人写一句简短温馨的中文寄语（20字以内）。`,
        "",
        apiKey,
        geminiModel,
      ).then((quote) => setGreeting(quote))
    }
  }, [petInfo, apiKey, geminiModel])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const sendMessage = async () => {
    const text = inputText.trim()
    if (!text) return

    setChatMessages([...chatMessages, { role: "user", text }])
    setInputText("")

    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", text: '<span class="loading-dots">AI 正在深度分析中</span>' },
    ])

    const sysPrompt = "你是一位宠物医生。根据用户描述提供：1. 可能病因 2. 护理建议 3. 就医预警。"
    const aiResponse = await callAI(text, sysPrompt, apiKey, geminiModel)

    setChatMessages((prev) => {
      const newMessages = [...prev]
      newMessages[newMessages.length - 1] = { role: "assistant", text: aiResponse }
      return newMessages
    })
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(",")[1]
      const desc = inputText.trim()

      setChatMessages((prev) => [...prev, { role: "user", image: dataUrl, text: desc }])
      setInputText("")

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: '<span class="loading-dots">AI 正在深度分析中</span>' },
      ])

      const parts = []
      if (desc) parts.push({ text: desc })
      parts.push({ inline_data: { mime_type: file.type || "image/jpeg", data: base64 } })

      const sysPrompt = "你是一位宠物医生。请根据上传照片和描述提供：1. 可能病因 2. 护理建议 3. 就医预警。"
      const ai = await callAIWithParts(parts, sysPrompt, apiKey, geminiModel)

      setChatMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = { role: "assistant", text: ai }
        return newMessages
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF9F5]">
      <div className="p-4">
        <div className="glass-morphism rounded-2xl p-3 flex items-center gap-3 border border-[#F1E0D6] animate-fade">
          <div className="w-10 h-10 bg-[#D2B48C] rounded-full flex items-center justify-center text-white font-bold text-xl">
            {petInfo?.avatar || "🐱"}
          </div>
          <div>
            <p className="text-[10px] text-[#A1887F] font-bold">{petInfo?.name}今日碎碎念 ✨</p>
            <p className="text-xs text-[#5D4037] mt-0.5 font-medium italic">{greeting}</p>
          </div>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {chatMessages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-[#D2B48C] text-white shadow-lg"
                  : "bg-white text-[#5D4037] card-shadow border border-[#F1E0D6]"
              }`}
            >
              {m.image && (
                <img
                  src={m.image || "/placeholder.svg"}
                  className="w-40 h-40 object-cover rounded-xl mb-2"
                  alt="uploaded"
                />
              )}
              <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br>") }} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-[#F1E0D6]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="描述它的症状..."
            className="flex-1 bg-[#FFF9F5] rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#D2B48C]"
          />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#FFF9F5] text-[#5D4037] p-3 rounded-xl border border-[#F1E0D6]"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button onClick={sendMessage} className="bg-[#D2B48C] text-white p-3 rounded-xl">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
