import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

const DISCONNECT_FLAG = 'wallet_disconnected';

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length > 0) {
      try {
        // Re-initialize provider to ensure we have the latest state
        const currentProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(currentProvider);
        setAccount(accounts[0]);
        setSigner(currentProvider.getSigner());
        setIsConnected(true);
        localStorage.removeItem(DISCONNECT_FLAG);
      } catch (error) {
        console.error('Error handling account change:', error);
        handleDisconnect();
      }
    } else {
      handleDisconnect();
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setAccount(null);
    setSigner(null);
    setIsConnected(false);
    localStorage.setItem(DISCONNECT_FLAG, 'true');
  }, []);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          
          const wasDisconnected = localStorage.getItem(DISCONNECT_FLAG) === 'true';
          
          if (!wasDisconnected) {
            const accounts = await window.ethereum.request({ 
              method: 'eth_accounts' 
            });
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setSigner(provider.getSigner());
              setIsConnected(true);
            }
          }

          // Remove any existing listeners first to prevent duplicates
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('disconnect', handleDisconnect);

          // Add new listeners
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('disconnect', handleDisconnect);
        } catch (error) {
          console.error('Error initializing Web3:', error);
        }
      }
      setIsLoading(false);
    };

    initWeb3();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [handleAccountsChanged, handleDisconnect]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to connect your wallet');
    }

    try {
      // Re-initialize provider before connecting
      const currentProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(currentProvider);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setSigner(currentProvider.getSigner());
        setIsConnected(true);
        localStorage.removeItem(DISCONNECT_FLAG);
        return accounts[0];
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      handleDisconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  const checkWalletConnection = useCallback(() => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask to connect your wallet');
    }
    if (!isConnected) {
      throw new Error('Please connect your wallet first');
    }
  }, [isConnected]);

  const getBalance = async () => {
    checkWalletConnection();
    try {
      const balance = await provider.getBalance(account);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider 
      value={{ 
        provider,
        signer,
        account,
        isConnected,
        isLoading,
        connectWallet,
        disconnectWallet,
        getBalance,
        checkWalletConnection
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);