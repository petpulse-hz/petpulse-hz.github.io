"use client"

import { X } from "lucide-react"
import { useAppContext } from "../context/AppContext"

export default function Modal() {
  const { isModalOpen, setIsModalOpen, modalContent } = useAppContext()

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-fade p-6 relative max-h-[85vh] overflow-y-auto">
        {modalContent}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
