import * as React from 'react';
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import { Download } from 'lucide-react';

export function WalletOptions() {
  const { connect, connectors } = useConnect();
  const [showDownloadOptions, setShowDownloadOptions] = React.useState(false);
  const { isConnected, address, chain, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });

  // Define chains manually
  const supportedChains = [
    { id: 1, name: 'Ethereum' },
    { id: 137, name: 'Polygon' },
    { id: 42161, name: 'Arbitrum' },
    { id: 10, name: 'Optimism' },
    { id: 56, name: 'BNB Chain' },
    { id: 43114, name: 'Avalanche' },
  ];

  // State for tracking chain switching
  const [isSwitching, setIsSwitching] = React.useState(false);
  const [switchError, setSwitchError] = React.useState(null);

  // Handle chain switching
  const handleSwitchChain = async (e) => {
    const chainId = parseInt(e.target.value, 10);
    if (!chainId || !connector) return;

    setIsSwitching(true);
    setSwitchError(null);

    try {
      await connector.switchChain({ chainId });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      setSwitchError(error.message || 'Failed to switch chain');
    } finally {
      setIsSwitching(false);
    }
  };

  // Popular wallet download links
  const walletDownloadOptions = [
    { name: 'MetaMask', url: 'https://metamask.io/download/' },
    { name: 'Coinbase Wallet', url: 'https://www.coinbase.com/wallet/downloads' },
    { name: 'Trust Wallet', url: 'https://trustwallet.com/download' },
    { name: 'Rainbow', url: 'https://rainbow.me/' },
  ];

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#C1C433,#FFC000,#04E2E2,#02CFCF)]"
    style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="p-8 bg-[#0A1027] border-8 rounded-lg shadow-lg max-w-md w-full">
        {isConnected ? (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              {ensAvatar && (
                <img alt="ENS Avatar" src={ensAvatar} className="w-10 h-10 rounded-full mr-3" />
              )}
              <div className="overflow-hidden">
                <div className="font-medium truncate">
                  {ensName
                    ? ensName
                    : address &&
                      `${address.slice(0, 6)}...${address.slice(-4)}`}
                </div>
                {ensName && address && (
                  <div className="text-sm text-gray-500 truncate">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </div>
                )}
              </div>
            </div>
            {connector?.switchChain && (
              <div className="mb-4">
                <label
                  htmlFor="chain-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Network
                </label>
                <select
                  id="chain-select"
                  value={chain?.id || ''}
                  onChange={handleSwitchChain}
                  disabled={isSwitching}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select network
                  </option>
                  {supportedChains.map((chainOption) => (
                    <option key={chainOption.id} value={chainOption.id}>
                      {chainOption.name}
                    </option>
                  ))}
                </select>
                {isSwitching && (
                  <div className="mt-1 text-sm text-blue-600">
                    Switching networks...
                  </div>
                )}
                {switchError && (
                  <div className="mt-1 text-sm text-red-600">{switchError}</div>
                )}
              </div>
            )}
            <button
              onClick={() => disconnect()}
              className="w-full px-4 py-2 bg-gradient-to-t from-[#04E2E2] to-[#00BBBB] hover:from-[#00BBBB] hover:to-[#04E2E2] text-white rounded-md transition-all duration-300"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-center text-gray-800 mb-4">
              Connect Wallet
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    console.log('clicked', connector.name);
                    connect({ connector })
                      .then((result) => console.log('Connection result:', result))
                      .catch((error) => console.error('Connection error:', error));
                  }}
                  className="bg-gradient-to-t from-[#04E2E2] to-[#00BBBB] hover:from-[#00BBBB] hover:to-[#04E2E2] flex items-center justify-center px-4 py-3 text-white rounded-md transition-all duration-300"
                >
                  {getWalletIcon(connector.name)}
                  <span className="ml-2">{connector.name}</span>
                </button>
              ))}
            </div>

            <div className="relative mt-6 border-t pt-4">
              <p className="text-sm text-gray-500 mb-3">Don't have a wallet yet?</p>
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="flex items-center px-4 py-2 bg-[#FEC110] hover:bg-[#02CFCF] text-gray-800 rounded-md transition-colors text-sm"
              >
                <Download size={16} className="mr-2" />
                <span> Download a wallet</span>
              </button>
              {showDownloadOptions && (
                <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg p-3 z-10 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-2 font-medium">
                    Select a wallet to download:
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {walletDownloadOptions.map((wallet) => (
                      <a
                        key={wallet.name}
                        href={wallet.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 hover:bg-gray-100 rounded text-sm text-gray-700 flex items-center"
                      >
                        {getWalletIcon(wallet.name)}
                        <span className="ml-2">{wallet.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get wallet icons
function getWalletIcon(walletName) {
  const name = walletName.toLowerCase();

  if (name.includes('metamask')) {
    return <div className="w-5 h-5 bg-orange-500 rounded-full flex-shrink-0" />;
  } else if (name.includes('coinbase')) {
    return <div className="w-5 h-5 bg-blue-400 rounded-full flex-shrink-0" />;
  } else if (name.includes('wallet connect')) {
    return <div className="w-5 h-5 bg-blue-600 rounded-full flex-shrink-0" />;
  } else if (name.includes('trust')) {
    return <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0" />;
  } else if (name.includes('rainbow')) {
    return <div className="w-5 h-5 bg-purple-500 rounded-full flex-shrink-0" />;
  } else {
    return <div className="w-5 h-5 bg-gray-400 rounded-full flex-shrink-0" />;
  }
}