"use client"

import { Cat, MapPin, Stethoscope, Calculator, Ban, Scale, Key } from "lucide-react"
import { useAppContext } from "../../context/AppContext"
import ApiKeyModal from "../modals/ApiKeyModal"

export default function MeTab() {
  const { pets, setPets, currentPetId, setCurrentPetId, setModalContent, setIsModalOpen } = useAppContext()

  const switchPet = (id: number) => {
    setCurrentPetId(id)
  }

  const openAddPetModal = () => {
    setModalContent(
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-[#5D4037]">添加新宠物</h3>
        <div className="space-y-3">
          <input
            id="pet-name"
            placeholder="宠物昵称"
            className="w-full bg-[#FFF9F5] p-3 rounded-xl text-sm border border-[#F1E0D6]"
          />
          <div className="flex gap-2">
            <select id="pet-species" className="flex-1 bg-[#FFF9F5] p-3 rounded-xl text-sm border border-[#F1E0D6]">
              <option value="猫">猫</option>
              <option value="狗">狗</option>
            </select>
            <select id="pet-gender" className="flex-1 bg-[#FFF9F5] p-3 rounded-xl text-sm border border-[#F1E0D6]">
              <option value="弟弟">弟弟</option>
              <option value="妹妹">妹妹</option>
            </select>
          </div>
          <input
            id="pet-breed"
            placeholder="品种 (如: 英短)"
            className="w-full bg-[#FFF9F5] p-3 rounded-xl text-sm border border-[#F1E0D6]"
          />
          <input
            id="pet-age"
            placeholder="年龄 (如: 1岁)"
            className="w-full bg-[#FFF9F5] p-3 rounded-xl text-sm border border-[#F1E0D6]"
          />
          <input
            id="pet-weight"
            type="number"
            placeholder="体重 (kg)"
            className="w-full bg-[#FFF9F5] p-3 rounded-xl text-sm border border-[#F1E0D6]"
          />
        </div>
        <button
          onClick={() => {
            const name = (document.getElementById("pet-name") as HTMLInputElement).value
            const species = (document.getElementById("pet-species") as HTMLSelectElement).value
            const breed = (document.getElementById("pet-breed") as HTMLInputElement).value
            const age = (document.getElementById("pet-age") as HTMLInputElement).value
            const weight = Number.parseFloat((document.getElementById("pet-weight") as HTMLInputElement).value) || 0
            const gender = (document.getElementById("pet-gender") as HTMLSelectElement).value

            if (!name) return alert("请输入昵称")

            setPets([
              ...pets,
              {
                id: Date.now(),
                name,
                species,
                breed,
                age,
                weight,
                gender,
                avatar: species === "猫" ? "🐱" : "🐶",
              },
            ])
            setIsModalOpen(false)
          }}
          className="w-full bg-[#D2B48C] text-white py-3 rounded-xl font-bold"
        >
          保存档案
        </button>
      </div>,
    )
    setIsModalOpen(true)
  }

  const openApiModal = () => {
    setModalContent(<ApiKeyModal />)
    setIsModalOpen(true)
  }

  return (
    <div className="p-4 space-y-6 animate-fade pb-24">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-[#5D4037] flex items-center gap-2">
            <Cat className="w-4 h-4 text-[#D2B48C]" /> 我的爱宠
          </h3>
          <button
            onClick={openAddPetModal}
            className="text-[10px] bg-[#D2B48C] text-white px-2 py-1 rounded-lg shadow-sm active:scale-95 transition-transform"
          >
            + 添加
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {pets.map((p) => (
            <div
              key={p.id}
              onClick={() => switchPet(p.id)}
              className={`relative flex-shrink-0 w-36 p-3 rounded-2xl border transition-all cursor-pointer ${
                currentPetId === p.id
                  ? "bg-[#D2B48C] text-white border-[#D2B48C] shadow-lg scale-105"
                  : "bg-white text-[#5D4037] border-[#F1E0D6] card-shadow"
              }`}
            >
              <div className="text-3xl mb-2">{p.avatar}</div>
              <div className="font-bold text-sm truncate">{p.name}</div>
              <div className="text-[10px] opacity-80 truncate">
                {p.breed} · {p.age}
              </div>
              {currentPetId === p.id && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 rounded-3xl border border-[#F1E0D6] card-shadow">
        <h3 className="font-bold text-sm mb-4 text-[#5D4037]">实用工具</h3>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-[#FFF9F5] rounded-xl hover:bg-[#F1E0D6] transition-colors">
            <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#5D4037]">年龄换算</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-[#FFF9F5] rounded-xl hover:bg-[#F1E0D6] transition-colors">
            <div className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#5D4037]">禁忌查询</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 bg-[#FFF9F5] rounded-xl hover:bg-[#F1E0D6] transition-colors">
            <div className="w-8 h-8 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#5D4037]">喂食计算</span>
          </button>
          <button
            onClick={openApiModal}
            className="flex flex-col items-center gap-2 p-3 bg-[#FFF9F5] rounded-xl hover:bg-[#F1E0D6] transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-[#5D4037]">API 设置</span>
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-sm text-[#5D4037]">医疗服务</h3>

        <div className="bg-white p-4 rounded-3xl border border-[#F1E0D6] card-shadow flex items-center gap-4 active:scale-95 transition-transform cursor-pointer">
          <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-[#5D4037]">附近宠物医院</h4>
            <p className="text-[10px] text-[#A1887F]">查看周边 3km 内认证医院</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#D2B48C] to-[#C4A484] p-4 rounded-3xl card-shadow flex items-center gap-4 text-white active:scale-95 transition-transform cursor-pointer">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">宠物医师在线</h4>
            <p className="text-[10px] opacity-90">专业医师 24h 实时问诊</p>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg">LIVE</span>
        </div>
      </section>
    </div>
  )
}
