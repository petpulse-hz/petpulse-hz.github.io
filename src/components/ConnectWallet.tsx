"use client"

import { useEffect, useState } from "react"
import { ccc } from "@ckb-ccc/connector-react"

const truncateAddress = (address: string, startLength = 10, endLength = 6) => {
  if (!address) return ""
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

export default function ConnectWallet() {
  const { open, disconnect, wallet } = ccc.useCcc()
  const [balance, setBalance] = useState("")
  const [address, setAddress] = useState("")
  const signer = ccc.useSigner()

  useEffect(() => {
    if (!signer) {
      setBalance("")
      setAddress("")
      return
    }
    // Get address
    ;(async () => {
      try {
        const addr = await signer.getRecommendedAddress()
        setAddress(addr)
      } catch (error) {
        console.error("Failed to get address:", error)
      }
    })()

    // Get balance
    ;(async () => {
      try {
        const capacity = await signer.getBalance()
        setBalance(ccc.fixedPointToString(capacity))
      } catch (error) {
        console.error("Failed to get balance:", error)
      }
    })()

    return () => {}
  }, [signer])

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setBalance("")
      setAddress("")
    } catch (error) {
      console.error("Failed to disconnect:", error)
    }
  }

  const renderConnectWalletBtn = () => {
    return (
      <button
        onClick={open}
        className="border border-[#D2B48C] text-[#5D4037] hover:bg-[#FFF9F5] text-xs bg-transparent px-3 py-1.5 rounded-md font-medium transition-colors"
      >
        连接钱包
      </button>
    )
  }

  const renderConnectedWalletInfo = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end text-xs">
          {wallet && <span className="text-[#5D4037] font-medium">{wallet.name}</span>}
          <span className="text-[#8B7355] text-[10px]">{balance} CKB</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="border border-[#D2B48C] text-[#5D4037] hover:bg-[#FFF9F5] text-xs px-2 py-1 rounded-md bg-transparent font-medium transition-colors"
        >
          {truncateAddress(address, 6, 4)}
        </button>
      </div>
    )
  }

  return <div className="flex items-center">{wallet ? renderConnectedWalletInfo() : renderConnectWalletBtn()}</div>
}
