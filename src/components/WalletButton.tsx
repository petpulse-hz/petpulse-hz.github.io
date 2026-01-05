import React from 'react';
import { createPortal } from 'react-dom';
import { ccc } from '@ckb-ccc/connector-react';
import { Wallet } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const { wallet, open, disconnect } = ccc.useCcc();
  const signer = ccc.useSigner();
  const [address, setAddress] = React.useState<string>("");

  React.useEffect(() => {
    if (signer) {
      (async () => {
        setAddress(await signer.getRecommendedAddress());
      })();
    } else {
      setAddress("");
    }
  }, [signer]);

  const handleConnect = () => {
    open();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const container = document.getElementById('wallet-root');
  if (!container) return null;

  if (wallet) {
    const shortAddress = address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : '已连接';

    return createPortal(
      <button 
        onClick={handleDisconnect} 
        className="flex items-center gap-1 px-3 py-1.5 text-[#D2B48C] bg-[#FFF9F5] hover:bg-[#F1E0D6] rounded-full border border-[#F1E0D6] transition-colors"
        title="点击断开连接"
      >
        <Wallet className="w-4 h-4" />
        <span className="text-[10px] font-bold">{shortAddress}</span>
      </button>,
      container
    );
  }

  return createPortal(
    <button 
      onClick={handleConnect} 
      className="p-2 text-[#D2B48C] hover:bg-[#FFF9F5] rounded-full transition-colors"
      title="连接钱包"
    >
      <Wallet className="w-5 h-5" />
    </button>,
    container
  );
};
