import React, { useState } from 'react';
import { Settings, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';

// Configuration constants - move these to an env file in production
const PAYMENT_ADDRESS = '0x8f643aCb27486C51012aF4ffE39F87ACbaCc27BE';
const TESTING_MODE = true; // Toggle this for testing
const REQUIRED_PAYMENT = TESTING_MODE 
  ? ethers.utils.parseEther('0')  // No payment in testing mode
  : ethers.utils.parseEther('0.01'); // 0.01 ETH in production

const ConfigurationCard = ({ 
  botName, 
  setBotName, 
  systemPrompt, 
  setSystemPrompt, 
  interval, 
  setInterval, 
  onSave, 
  isBotCreated,
  loading 
}) => {
  const { 
    signer, 
    account, 
    isConnected,
    connectWallet,
    checkWalletConnection,
    getBalance 
  } = useWeb3();
  
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleCreateBot = async () => {
    try {
      if (!isConnected) {
        await connectWallet();
        return;
      }

      setPaymentLoading(true);
      setPaymentError(null);

      // Skip payment checks in testing mode
      if (!TESTING_MODE) {
        checkWalletConnection();
        
        // Check if user has enough ETH
        const balance = await getBalance();
        if (ethers.utils.parseEther(balance).lt(REQUIRED_PAYMENT)) {
          throw new Error('Insufficient ETH balance');
        }

        // Send payment transaction
        const tx = await signer.sendTransaction({
          to: PAYMENT_ADDRESS,
          value: REQUIRED_PAYMENT,
        });

        console.log(tx);

        // Wait for transaction confirmation
        await tx.wait();

        console.log('Transaction confirmed');
      }

      // Call the original onSave function after payment (or immediately in testing mode)
      await onSave();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(
        error.message === 'Insufficient ETH balance'
          ? 'Insufficient ETH balance. Please make sure you have at least 0.01 ETH.'
          : error.message === 'Please connect your wallet first'
          ? 'Please connect your wallet to continue.'
          : 'Failed to process payment. Please try again.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Bot Configuration</h2>
      </div>

      {!isBotCreated && !TESTING_MODE && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            Creating a new bot requires a one-time payment of 0.01 ETH.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Bot Name</label>
          <input 
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="Enter your bot's name"
          />
        </div>
      
        <div>
          <label className="block text-sm font-medium mb-2">System Prompt</label>
          <textarea 
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter the system prompt for your AI bot..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Post Interval (minutes)
          </label>
          <input 
            type="number" 
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
            min={1}
          />
        </div>

        {paymentError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{paymentError}</span>
          </div>
        )}

        <button
          onClick={isBotCreated ? onSave : handleCreateBot}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
          disabled={loading || paymentLoading}
        >
          {paymentLoading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {isBotCreated 
            ? 'Save Configuration' 
            : !isConnected 
              ? 'Connect Wallet to Create Bot' 
              : paymentLoading 
                ? 'Processing Payment...' 
                : TESTING_MODE 
                  ? 'Create Bot (Testing Mode)' 
                  : 'Create Bot (0.01 ETH)'}
        </button>

        {!isBotCreated && isConnected && (
          <p className="text-sm text-gray-500 mt-2">
            Connected wallet: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}

        {TESTING_MODE && (
          <p className="text-xs text-yellow-600 mt-2">
            🔧 Testing Mode Active - No payment required
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfigurationCard;