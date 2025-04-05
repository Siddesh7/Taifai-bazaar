import { type PrivyClientConfig } from '@privy-io/react-auth';

type PrivyConfig = PrivyClientConfig & {
  appId: string;
};

// Configuration for Privy Auth
export const privyConfig: PrivyConfig = {
  appId: 'cm9355f1c01tul40mblv0jjv2',
  
  loginMethods: ['wallet', 'email', 'google', 'twitter'],
  
  // Appearance customization options
  appearance: {
    theme: 'dark',
    accentColor: '#eab308', 
    logo: 'https://dummyimage.com/100x100/eab308/fff',
  },
  
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
} 