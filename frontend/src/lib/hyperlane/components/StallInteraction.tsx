"use client";

import { useState } from 'react';

// StallInteraction component for handling Hyperlane cross-chain swaps
interface StallInteractionProps {
  stallId: number;
  stallName: string;
  walletAddress?: string; // Make wallet address optional
  onClose: () => void;
}

export const StallInteraction = ({ 
  stallId, 
  stallName,
  walletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Default to mock address if not provided
  onClose 
}: StallInteractionProps) => {
  const [sourceChain, setSourceChain] = useState<string>("rootstock-mainnet");
  const [targetChain, setTargetChain] = useState<string>("celo-mainnet");
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Token lists for each chain
  const tokens = {
    "rootstock-mainnet": [
      { symbol: "RBTC", name: "Rootstock BTC", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "DOC", name: "Dollar on Chain", address: "0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db" },
      { symbol: "RIF", name: "RIF Token", address: "0x2aCc95758f8b5F583470bA265Eb685a8f45fC9D5" },
      { symbol: "SOV", name: "Sovryn", address: "0xEFc78fc7d48b64958315949279Ba181c2114ABBd" },
    ],
    "celo-mainnet": [
      { symbol: "CELO", name: "Celo", address: "0x0000000000000000000000000000000000000000" },
      { symbol: "cUSD", name: "Celo Dollar", address: "0x765DE816845861e75A25fCA122bb6898B8B1282a" },
      { symbol: "cEUR", name: "Celo Euro", address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73" },
      { symbol: "cREAL", name: "Celo Brazilian Real", address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787" },
    ]
  };

  const [sourceToken, setSourceToken] = useState(tokens["rootstock-mainnet"][0]);
  const [targetToken, setTargetToken] = useState(tokens["celo-mainnet"][0]);

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    
    try {
      setError(null);
      setIsSubmitting(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock transaction hash
      const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      console.log("Mock transaction submitted:", {
        from: walletAddress,
        sourceChain,
        targetChain,
        sourceToken: sourceToken.symbol,
        targetToken: targetToken.symbol,
        amount,
        txHash: mockTxHash
      });
      
      setTxHash(mockTxHash);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      setIsSubmitting(false);
      console.error("Transaction error:", err);
    }
  };

  const handleSourceChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = e.target.value;
    setSourceChain(newChain);
    setSourceToken(tokens[newChain as keyof typeof tokens][0]);
  };

  const handleTargetChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChain = e.target.value;
    setTargetChain(newChain);
    setTargetToken(tokens[newChain as keyof typeof tokens][0]);
  };

  const swapDirection = () => {
    // Swap source and target chains
    const tempChain = sourceChain;
    const tempToken = sourceToken;
    
    setSourceChain(targetChain);
    setSourceToken(tokens[targetChain as keyof typeof tokens][0]);
    
    setTargetChain(tempChain);
    setTargetToken(tempToken);
  };

  const openExplorer = () => {
    if (!txHash) return;
    
    const explorerUrl = sourceChain === "rootstock-mainnet"
      ? "https://explorer.rsk.co"
      : "https://explorer.celo.org";
    window.open(`${explorerUrl}/tx/${txHash}`, '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{stallName}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        {txHash ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Swap Successful!</h3>
            <p className="text-slate-300 mb-4">Your cross-chain swap has been initiated.</p>
            <div className="bg-slate-900 p-3 rounded mb-4 break-all">
              <p className="text-xs text-slate-400">Transaction Hash:</p>
              <p className="text-sm text-slate-300">{txHash}</p>
              <button
                onClick={openExplorer}
                className="text-xs text-indigo-400 hover:text-indigo-300 mt-2"
              >
                View on Explorer
              </button>
            </div>
            <button 
              onClick={() => {
                setTxHash(null);
                setAmount("");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded w-full"
            >
              New Swap
            </button>
          </div>
        ) : (
          <>
            <p className="text-slate-300 mb-4">
              Swap tokens across Rootstock and Celo mainnets using Hyperlane's intent-based bridging.
            </p>
            
            <div className="bg-slate-900 p-3 rounded mb-4">
              <p className="text-xs text-slate-400">Connected Wallet</p>
              <p className="text-sm text-slate-200 truncate">{walletAddress}</p>
              <p className="text-xs text-indigo-400 mt-1">
                Network: {sourceChain === "rootstock-mainnet" ? "Rootstock Mainnet" : "Celo Mainnet"}
              </p>
            </div>
            
            <form onSubmit={handleSwap}>
              <div className="flex items-center mb-4">
                <div className="flex-1 mr-2">
                  <label className="block text-slate-300 mb-2">Source Chain</label>
                  <select 
                    value={sourceChain}
                    onChange={handleSourceChainChange}
                    className="bg-slate-700 text-white w-full p-2 rounded"
                  >
                    <option value="rootstock-mainnet">Rootstock Mainnet</option>
                    <option value="celo-mainnet">Celo Mainnet</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-center mt-4">
                  <button 
                    type="button"
                    onClick={swapDirection}
                    className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full"
                    title="Swap direction"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 ml-2">
                  <label className="block text-slate-300 mb-2">Target Chain</label>
                  <select 
                    value={targetChain}
                    onChange={handleTargetChainChange}
                    className="bg-slate-700 text-white w-full p-2 rounded"
                  >
                    <option value="rootstock-mainnet">Rootstock Mainnet</option>
                    <option value="celo-mainnet">Celo Mainnet</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Source Token</label>
                <select 
                  value={sourceToken.symbol}
                  onChange={(e) => {
                    const selected = tokens[sourceChain as keyof typeof tokens].find(
                      t => t.symbol === e.target.value
                    );
                    if (selected) setSourceToken(selected);
                  }}
                  className="bg-slate-700 text-white w-full p-2 rounded"
                >
                  {tokens[sourceChain as keyof typeof tokens].map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-slate-300 mb-2">Amount</label>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="bg-slate-700 text-white w-full p-2 rounded"
                  min="0"
                  step="0.000001"
                />
              </div>
              
              <div className="flex justify-center my-4">
                <div className="bg-slate-700 p-2 rounded-full">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-slate-300 mb-2">Target Token</label>
                <select 
                  value={targetToken.symbol}
                  onChange={(e) => {
                    const selected = tokens[targetChain as keyof typeof tokens].find(
                      t => t.symbol === e.target.value
                    );
                    if (selected) setTargetToken(selected);
                  }}
                  className="bg-slate-700 text-white w-full p-2 rounded"
                >
                  {tokens[targetChain as keyof typeof tokens].map(token => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.name} ({token.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-300">
                  {error}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded ${
                  isSubmitting 
                    ? 'bg-indigo-800 text-indigo-200 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Swap Tokens'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}; 