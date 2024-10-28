import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterCard = ({
  isConnected,
  twitterUsername,
  onTwitterConnect,
  loading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Twitter className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Twitter Connection</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Twitter Account</h3>
            <p className="text-sm text-gray-500">
              {isConnected 
                ? `Connected as @${twitterUsername}` 
                : 'Not connected'}
            </p>
          </div>
          <button 
            className={`px-4 py-2 rounded-md text-white ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={onTwitterConnect}
            disabled={loading}
          >
            {loading ? 'Loading...' : (isConnected ? 'Disconnect' : 'Connect Twitter')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterCard;