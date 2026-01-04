"use client"

import React from "react"
import { ccc } from "@ckb-ccc/connector-react"

type Network = 'mainnet' | 'testnet';

export function CccProvider({ children, network }: { children: React.ReactNode; network?: Network }) {
  const defaultClient = React.useMemo(() => {
    return network === 'mainnet' ? new ccc.ClientPublicMainnet() : new ccc.ClientPublicTestnet();
  }, [network]);

  return (
    <ccc.Provider defaultClient={defaultClient} clientOptions={[
      { name: 'CKB Testnet', client: new ccc.ClientPublicTestnet() },
      { name: 'CKB Mainnet', client: new ccc.ClientPublicMainnet() },
    ]}>
      {children}
    </ccc.Provider>
  )
}
