"use client"

import { useState } from "react"
import * as Icons from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import { callAI } from "../../utils/ai"

interface KnowledgeItem {
  title: string
  icon: string
  desc: string
  color: string
  tag: string
}

const knowledgeData: Record<string, KnowledgeItem[]> = {
  cat: [
    { title: "猫咪消化系统", icon: "FlaskConical", desc: "急性肠胃炎与毛球症预防", color: "blue", tag: "肠胃" },
    { title: "猫咪应激反应", icon: "Zap", desc: "新成员加入与搬家指南", color: "yellow", tag: "心理" },
    { title: "猫传染性腹膜炎", icon: "ShieldAlert", desc: "441治疗与早期识别", color: "red", tag: "传染病" },
    { title: "猫咪泌尿健康", icon: "Droplet", desc: "闭尿风险与饮水诱导", color: "indigo", tag: "高发病" },
    { title: "老年猫护理", icon: "Heart", desc: "7岁+饮食与关节养护", color: "rose", tag: "生命周期" },
    { title: "猫咪换季脱发", icon: "Scissors", desc: "正常换毛与皮肤病鉴别", color: "orange", tag: "皮肤" },
  ],
  dog: [
    { title: "狗狗急性肠胃炎", icon: "Soup", desc: "暴饮暴食与禁食人类食物", color: "green", tag: "肠胃" },
    { title: "犬类服从训练", icon: "Dog", desc: "随行、坐下等核心指令", color: "purple", tag: "训练" },
    { title: "狗狗皮肤真菌", icon: "Microscope", desc: "真菌/螨虫/湿疹鉴别", color: "orange", tag: "皮肤" },
    { title: "心丝虫预防", icon: "Activity", desc: "蚊虫叮咬与定期驱虫", color: "red", tag: "寄生虫" },
    { title: "老年犬痴呆预防", icon: "Brain", desc: "益智玩具与慢节奏散步", color: "sky", tag: "生命周期" },
    { title: "犬细小病毒预警", icon: "Thermometer", desc: "幼犬高发症状与应急处理", color: "red", tag: "传染病" },
  ],
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-500 text-blue-500",
  yellow: "bg-yellow-600 text-yellow-600",
  red: "bg-red-500 text-red-500",
  indigo: "bg-indigo-500 text-indigo-500",
  rose: "bg-rose-500 text-rose-500",
  orange: "bg-orange-500 text-orange-500",
  green: "bg-green-500 text-green-500",
  purple: "bg-purple-500 text-purple-500",
  sky: "bg-sky-500 text-sky-500",
}

export default function KnowledgeTab() {
  const [activeSpecies, setActiveSpecies] = useState<"cat" | "dog">("cat")
  const { setModalContent, setIsModalOpen, apiKey, geminiModel } = useAppContext()

  const items = knowledgeData[activeSpecies]

  const openDetail = async (title: string) => {
    setModalContent(
      <div className="flex flex-col items-center justify-center py-10">
        <div className="loading-dots text-[#D2B48C] font-bold text-xl mb-2"></div>
        <p className="text-xs text-[#D2B48C] font-bold">正在调取云端知识库...</p>
      </div>,
    )
    setIsModalOpen(true)

    const aiDetail = await callAI(
      `请针对"${title}"写一篇科普短文，包含症状、病因、预防。字数300左右。`,
      "",
      apiKey,
      geminiModel,
    )

    setModalContent(
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#D2B48C] rounded-full"></div>
          <h3 className="font-bold text-lg text-[#5D4037]">{title}</h3>
        </div>
        <div className="text-sm leading-relaxed text-[#5D4037] space-y-3">
          {aiDetail.split("\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
        <div className="mt-6 p-3 bg-red-50 rounded-xl border border-red-100">
          <p className="text-[10px] text-red-500 font-bold">⚠️ 科普仅供参考，不适请立即就医。</p>
        </div>
      </div>,
    )
  }

  return (
    <div className="p-4 space-y-6 animate-fade">
      <div className="flex p-1 bg-[#F1E0D6] rounded-2xl">
        <button
          onClick={() => setActiveSpecies("cat")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSpecies === "cat" ? "bg-white text-[#D2B48C] shadow-sm" : "text-[#A1887F]"
          }`}
        >
          猫咪频道
        </button>
        <button
          onClick={() => setActiveSpecies("dog")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSpecies === "dog" ? "bg-white text-[#D2B48C] shadow-sm" : "text-[#A1887F]"
          }`}
        >
          狗狗频道
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-8">
        {items.map((item, idx) => {
          const IconComponent = (Icons as any)[item.icon]
          return (
            <div
              key={idx}
              onClick={() => openDetail(item.title)}
              className="bg-white p-4 rounded-2xl card-shadow border border-[#F1E0D6] active:scale-95 transition-all cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-opacity-10 ${colorMap[item.color]}`}
              >
                {IconComponent && <IconComponent className="w-5 h-5" />}
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#FFF9F5] text-[#A1887F] font-bold border border-[#F1E0D6]">
                {item.tag}
              </span>
              <h4 className="text-xs font-bold mt-2 text-[#5D4037]">{item.title}</h4>
              <p className="text-[9px] text-[#A1887F] mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
