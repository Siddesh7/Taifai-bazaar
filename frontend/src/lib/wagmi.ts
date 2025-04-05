import { http, createConfig } from 'wagmi'
import { mainnet, base, sepolia, optimism, optimismSepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// connectors
export const config = createConfig({
  chains: [mainnet, base, sepolia, optimism, optimismSepolia],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
  },
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: '5c76d737fd95b7f8640107c71dd88975',
    }),
  ],
}) 