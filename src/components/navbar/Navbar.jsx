import React from 'react';
import WalletButton from './WalletButton';
import { useWeb3 } from '../../contexts/Web3Context';

const Navbar = () => {
  const { account, connectWallet, provider, disconnectWallet } = useWeb3();

  const handleAccountsChanged = (accounts) => {
    // Account changes are handled in the context
    if (accounts.length === 0) {
      disconnectWallet();
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-800">
            {'<AI_meme_IA>'}
            </span>
          </div>
          
          <div>
            <WalletButton
              isConnected={Boolean(account)}
              walletAddress={account}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              loading={!provider} // Loading state while Web3 initializes
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;