"use client"

import { useState } from "react"
import { Calendar, ShieldCheck, Syringe, PlusCircle, Sparkles } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { useAppContext } from "../../context/AppContext"
import { callAI } from "../../utils/ai"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Reminder {
  id: number
  title: string
  date: string
  repeat: string
  icon: string
}

interface WeightRecord {
  date: string
  weight: number
}

export default function HealthTab() {
  const { pets, currentPetId, setModalContent, setIsModalOpen, apiKey, geminiModel } = useAppContext()
  const petInfo = pets.find((p) => p.id === currentPetId)

  const [reminders] = useState<Reminder[]>([
    { id: 1, title: "体外驱虫", date: "2024-01-20", repeat: "每月一次", icon: "shield-check" },
    { id: 2, title: "联苗接种", date: "2024-03-15", repeat: "每年一次", icon: "syringe" },
  ])

  const [dailyLog] = useState({ date: "2024-01-01", food: "正常", poop: "正常", spirit: "活泼" })

  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([
    { date: "2023-11-01", weight: 3.2 },
    { date: "2023-12-01", weight: 3.8 },
    { date: "2024-01-01", weight: 4.1 },
  ])

  const [aiReport, setAiReport] = useState<string | null>(null)

  const chartData = {
    labels: weightHistory.map((w) => w.date.split("-").slice(1).join("/")),
    datasets: [
      {
        data: weightHistory.map((w) => w.weight),
        borderColor: "#D2B48C",
        borderWidth: 3,
        pointBackgroundColor: "#FFF",
        pointBorderColor: "#D2B48C",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(210,180,140,0.1)",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { display: false }, ticks: { font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    },
  }

  const openWeightModal = () => {
    setModalContent(
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-5 bg-[#D2B48C] rounded-full"></div>
          <h3 className="font-bold text-lg text-[#5D4037]">记录新体重</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-[#A1887F] font-bold block mb-1">测量日期</label>
            <input
              type="date"
              id="new-weight-date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full bg-[#FFF9F5] border border-[#F1E0D6] rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#A1887F] font-bold block mb-1">体重数值 (kg)</label>
            <input
              type="number"
              id="new-weight-val"
              step="0.1"
              placeholder="例如: 4.5"
              className="w-full bg-[#FFF9F5] border border-[#F1E0D6] rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <button
          onClick={() => {
            const date = (document.getElementById("new-weight-date") as HTMLInputElement).value
            const weight = Number.parseFloat((document.getElementById("new-weight-val") as HTMLInputElement).value)
            if (weight && weight > 0) {
              setWeightHistory((prev) =>
                [...prev, { date, weight }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
              )
              setIsModalOpen(false)
            }
          }}
          className="w-full mt-4 py-3 bg-[#D2B48C] text-white rounded-2xl font-bold text-sm shadow-md"
        >
          确认保存
        </button>
      </div>,
    )
    setIsModalOpen(true)
  }

  const generateAIReport = async () => {
    setAiReport(
      '<div class="p-8 text-center text-[#D2B48C] text-xs font-bold"><div class="loading-dots mb-2">分析中</div>AI 正根据档案生成报告...</div>',
    )

    const prompt = `宠物：${JSON.stringify(petInfo)}, 体重：${JSON.stringify(weightHistory)}`
    const sysInstruction = "生成一份简短的宠物健康报告（现状、趋势、本周建议）。使用Markdown格式。"
    const aiReportText = await callAI(prompt, sysInstruction, apiKey, geminiModel)

    const formatted = aiReportText
      .replace(/^### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^## (.*$)/gim, "<h4>$1</h4>")
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\n/gim, "<br>")

    setAiReport(formatted)
  }

  return (
    <div className="p-4 space-y-6 animate-fade">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-[#5D4037] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D2B48C]" /> 健康提醒
          </h3>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {reminders.map((r) => (
            <div key={r.id} className="flex-shrink-0 w-32 bg-white p-3 rounded-2xl border border-[#F1E0D6] card-shadow">
              {r.icon === "shield-check" ? (
                <ShieldCheck className="w-4 h-4 text-[#D2B48C] mb-2" />
              ) : (
                <Syringe className="w-4 h-4 text-[#D2B48C] mb-2" />
              )}
              <p className="text-[11px] font-bold">{r.title}</p>
              <p className="text-[9px] text-[#A1887F]">{r.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded-3xl border border-[#F1E0D6] card-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm">体重监测 (kg)</h3>
          <button
            onClick={openWeightModal}
            className="flex items-center gap-1 text-[10px] font-bold text-[#D2B48C] bg-[#FFF9F5] px-3 py-1.5 rounded-full border border-[#F1E0D6] active:scale-95 transition-all"
          >
            <PlusCircle className="w-3 h-3" /> 手动录入
          </button>
        </div>
        <div className="h-40">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>

      <section className="bg-white p-4 rounded-3xl border border-[#F1E0D6] card-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm">日常监测记录</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-[#FFF9F5] rounded-xl text-center">
            <span className="text-[9px] text-[#A1887F] block mb-1">饮食摄入</span>
            <div className="text-xs font-bold text-[#5D4037]">{dailyLog.food}</div>
          </div>
          <div className="p-3 bg-[#FFF9F5] rounded-xl text-center">
            <span className="text-[9px] text-[#A1887F] block mb-1">排便观察</span>
            <div className="text-xs font-bold text-green-600">{dailyLog.poop}</div>
          </div>
          <div className="p-3 bg-[#FFF9F5] rounded-xl text-center">
            <span className="text-[9px] text-[#A1887F] block mb-1">精神活力</span>
            <div className="text-xs font-bold text-orange-500">{dailyLog.spirit}</div>
          </div>
        </div>
        <button
          onClick={generateAIReport}
          className="w-full mt-4 py-3 bg-[#D2B48C] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
        >
          <Sparkles className="w-4 h-4" /> 生成 AI 智能周报
        </button>
      </section>

      {aiReport && (
        <div
          className="p-5 bg-gradient-to-br from-[#D2B48C] to-[#C4A484] rounded-3xl text-white text-xs animate-fade card-shadow"
          dangerouslySetInnerHTML={{ __html: `<div class="report-content">${aiReport}</div>` }}
        />
      )}
    </div>
  )
}
