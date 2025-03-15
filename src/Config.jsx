import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_REOWNED_KEY

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})