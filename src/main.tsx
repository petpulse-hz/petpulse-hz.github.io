import React from 'react';
import { createRoot } from 'react-dom/client';
import { ccc } from '@ckb-ccc/connector-react';
import { WalletButton } from './components/WalletButton';

// Wallet Component Entry
const globalRoot = document.getElementById('global-wallet-root') || (() => {
  const el = document.createElement('div');
  el.id = 'global-wallet-root';
  document.body.appendChild(el);
  return el;
})();

const walletRoot = createRoot(globalRoot);
walletRoot.render(
  <React.StrictMode>
    <ccc.Provider
        connectorProps={{
            style: {
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 9999,
            }
        }}
    >
      <Bridge />
      <WalletButton />
    </ccc.Provider>
  </React.StrictMode>
);

// Keep a hidden root for future expansions if needed, or remove it.
// For now, I'll remove the hidden root logic to keep it clean, as we have a real usage now.

function Bridge() {
  const { open, disconnect } = ccc.useCcc();
  const signer = ccc.useSigner();

  React.useEffect(() => {
    (window as any).cccBridge = {
      open,
      disconnect,
      isConnected: !!signer,
      getAddress: async () => signer ? await signer.getRecommendedAddress() : "",
      getBalanceCkb: async () => {
        if (!signer) return 0n;
        const shannons = await signer.getBalance();
        return (BigInt(shannons) / 100000000n);
      },
      payCkb: async (amountCkb: number, toAddress: string) => {
        if (!signer) {
          open();
          throw new Error("请先连接钱包");
        }
        const amount = BigInt(Math.floor(amountCkb)) * 100000000n;
        const addr = await ccc.Address.fromString(toAddress, signer.client);
        const output = ccc.CellOutput.from({
          capacity: ccc.fixedPointFrom(amount),
          lock: addr.script,
        });
        const tx = ccc.Transaction.from({
          cellDeps: [
            {
              outPoint: {
                txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
                index: '0x0',
              },
              depType: 'depGroup',
            }
          ],
          inputs: [],
          outputs: [output]
        });
        await tx.completeInputsByCapacity(signer)
        await tx.completeFeeBy(signer);
        const hash = await signer.sendTransaction(tx);
        return hash;
      }
    };
  }, [open, disconnect, signer]);

  return null;
}
