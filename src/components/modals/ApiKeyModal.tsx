"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../../context/AppContext"

export default function ApiKeyModal() {
  const { apiKey, setApiKey, geminiModel, setGeminiModel, setIsModalOpen } = useAppContext()
  const [localKey, setLocalKey] = useState(apiKey)
  const [localModel, setLocalModel] = useState(geminiModel)

  useEffect(() => {
    setLocalKey(apiKey)
    setLocalModel(geminiModel)
  }, [apiKey, geminiModel])

  const saveSettings = () => {
    setApiKey(localKey)
    setGeminiModel(localModel)
    if (typeof window !== "undefined") {
      localStorage.setItem("petpulse_api_key", localKey)
      localStorage.setItem("petpulse_model", localModel)
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-[#5D4037]">配置 AI API Key</h3>
      <p className="text-xs text-[#A1887F]">本应用使用 Google Gemini 模型。请配置 Key 以启用问诊功能。</p>

      <input
        type="password"
        value={localKey}
        onChange={(e) => setLocalKey(e.target.value)}
        placeholder="输入 API Key"
        className="w-full p-3 border border-[#F1E0D6] rounded-xl bg-[#FFF9F5] outline-none text-sm"
      />

      <div>
        <label className="text-[10px] text-[#A1887F] font-bold block mb-1">选择模型</label>
        <select
          value={localModel}
          onChange={(e) => setLocalModel(e.target.value)}
          className="w-full p-3 border border-[#F1E0D6] rounded-xl bg-[#FFF9F5] outline-none text-sm"
        >
          <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
          <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
        </select>
      </div>

      <div className="flex gap-2">
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-100 text-[#5D4037] py-3 rounded-xl font-bold text-xs flex items-center justify-center"
        >
          获取免费 Key
        </a>
        <button onClick={saveSettings} className="flex-1 bg-[#D2B48C] text-white py-3 rounded-xl font-bold text-sm">
          保存设置
        </button>
      </div>
    </div>
  )
}
