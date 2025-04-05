"use client";

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { privyConfig } from '@/lib/privy';
import { config } from '@/lib/wagmi';
import { useState } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Create a client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider appId={privyConfig.appId} config={privyConfig}>
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 