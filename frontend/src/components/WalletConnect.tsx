"use client";

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { cn } from '@/lib/utils';

interface WalletConnectProps {
  className?: string;
  onConnectionChange?: (isConnected: boolean) => void;
}

export function WalletConnect({ className, onConnectionChange }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  // Effect to update wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(formatAddress(address));
      onConnectionChange?.(true);
    } else {
      setWalletAddress(null);
      onConnectionChange?.(false);
    }
  }, [isConnected, address, onConnectionChange]);

  // Format the address to display like 0x1234...5678
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    if (ready) {
      if (authenticated) {
        // User is already authenticated with Privy
        // Try to connect with Wagmi if not already connected
        if (!isConnected) {
          const connector = connectors.find(c => c.name === 'Injected');
          if (connector) {
            try {
              await connectAsync({ connector });
            } catch (error) {
              console.error('Failed to connect wallet:', error);
            }
          }
        }
      } else {
        // User needs to authenticate with Privy first
        login();
      }
    }
  };

  const handleDisconnect = async () => {
    if (isConnected) {
      try {
        await disconnectAsync();
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
    
    if (authenticated) {
      logout();
    }
    
    setWalletAddress(null);
  };

  return (
    <button
      onClick={walletAddress ? handleDisconnect : handleConnect}
      className={cn(
        `px-4 py-2 rounded-md font-medium transition-all relative overflow-hidden group`,
        walletAddress
          ? "bg-green-600 hover:bg-green-700"
          : "bg-amber-600 hover:bg-amber-700",
        className
      )}
    >
      <span className="relative z-10">
        {walletAddress ? `${walletAddress} ✓` : "Connect Wallet"}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
    </button>
  );
} 