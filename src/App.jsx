 import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 import { WagmiProvider } from 'wagmi'
 import { config } from './Config'
import { WalletOptions } from './WalletOption'
 
 const queryClient = new QueryClient()
 
 function App() {
   return (
     <WagmiProvider config={config}>
       <QueryClientProvider client={queryClient}> 
        <WalletOptions/>
       </QueryClientProvider> 
     </WagmiProvider>
   )
 }


export default App
