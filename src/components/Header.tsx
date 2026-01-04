"use client"

import ConnectWallet from "./ConnectWallet"

interface HeaderProps {
  pageTitle: string
}

export default function Header({ pageTitle }: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-[#F1E0D6] z-50 sticky top-0">
      <div className="flex items-center gap-1">
        <span className="text-xl font-bold text-[#5D4037]">PetPulse</span>
        <span className="text-[#D2B48C] text-[10px] font-bold bg-[#FFF9F5] px-2 py-0.5 rounded-full border border-[#F1E0D6]">
          {pageTitle}
        </span>
      </div>
      <ConnectWallet />
    </header>
  )
}
