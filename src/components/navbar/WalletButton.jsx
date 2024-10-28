import React from 'react';

const WalletButton = ({ 
  isConnected, 
  walletAddress, 
  onConnect, 
  onDisconnect, 
  loading 
}) => {
  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

    console.log(isConnected);

  return (
    <button
      onClick={isConnected ? onDisconnect : onConnect}
      disabled={loading}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors duration-200
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${isConnected 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
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
          Connecting...
        </span>
      ) : isConnected ? (
        displayAddress
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};

export default WalletButton;
