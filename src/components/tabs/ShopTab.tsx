"use client"

import { useState } from "react"
import { useAppContext } from "../../context/AppContext"

interface Product {
  id: string
  name: string
  price: number
  cat: string
  icon: string
  desc: string
}

const shopProducts: Product[] = [
  { id: "cat-food", name: "猫粮", price: 20, cat: "猫粮", icon: "🐱", desc: "全价成猫粮 1.5kg" },
  { id: "dog-food", name: "狗粮", price: 20, cat: "狗粮", icon: "🐶", desc: "全价成犬粮 2kg" },
  { id: "toy", name: "宠物玩具", price: 5, cat: "玩具", icon: "🎾", desc: "耐咬磨牙球" },
  { id: "snack", name: "宠物零食", price: 3, cat: "零食", icon: "🍖", desc: "冻干鸡肉 50g" },
]

export default function ShopTab() {
  const [shopCategory, setShopCategory] = useState("全部")
  const { setModalContent, setIsModalOpen } = useAppContext()

  const cats = ["全部", "猫粮", "狗粮", "玩具", "零食"]
  const items = shopProducts.filter((p) => shopCategory === "全部" || p.cat === shopCategory)

  const openPayModal = (product: Product) => {
    setModalContent(
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{product.icon}</div>
          <div>
            <h3 className="font-bold text-lg text-[#5D4037]">{product.name}</h3>
            <p className="text-[10px] text-[#A1887F]">{product.desc}</p>
          </div>
        </div>
        <div className="bg-[#FFF9F5] p-4 rounded-xl border border-[#F1E0D6]">
          <div className="flex justify-between text-sm">
            <span>商品金额</span>
            <span>{product.price.toFixed(2)} USDI</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>运费</span>
            <span>0.00 USDI</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#5D4037] mt-2">
            <span>合计</span>
            <span>{product.price.toFixed(2)} USDI</span>
          </div>
        </div>
        <button
          onClick={() => confirmPay(product.id)}
          className="w-full bg-[#2ECC71] text-white py-3 rounded-xl font-bold"
        >
          立即支付
        </button>
      </div>,
    )
    setIsModalOpen(true)
  }

  const confirmPay = (pid: string) => {
    setIsModalOpen(false)

    setModalContent(
      <div className="flex flex-col items-center justify-center py-10">
        <div className="loading-dots text-[#2ECC71] font-bold text-xl mb-2"></div>
        <p className="text-xs text-[#5D4037]">正在支付...</p>
      </div>,
    )
    setIsModalOpen(true)

    setTimeout(() => {
      setIsModalOpen(false)
      const toast = document.createElement("div")
      toast.className =
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-[200] animate-fade"
      toast.innerText = "✅ 支付成功，订单已生成"
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 2000)
    }, 1200)
  }

  return (
    <div className="p-4 space-y-6 animate-fade">
      <div className="flex p-1 bg-[#F1E0D6] rounded-2xl overflow-x-auto no-scrollbar">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setShopCategory(c)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              shopCategory === c ? "bg-white text-[#D2B48C] shadow-sm" : "text-[#A1887F]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 pb-8">
        {items.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-2xl card-shadow border border-[#F1E0D6]">
            <div className="text-3xl mb-2">{p.icon}</div>
            <h4 className="text-xs font-bold text-[#5D4037]">{p.name}</h4>
            <p className="text-[9px] text-[#A1887F] mt-1">{p.desc}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-bold text-[#D2B48C]">{p.price} USDI</span>
              <button
                onClick={() => openPayModal(p)}
                className="text-[10px] bg-[#D2B48C] text-white px-2 py-1 rounded-lg active:scale-95 transition-transform"
              >
                购买
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
