
import React from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';

const StatusCard = ({
  isActive,
  isConnected,
  onToggleActive,
  loading
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        {isActive ? 
          <PlayCircle className="w-5 h-5 text-green-500" /> :
          <PauseCircle className="w-5 h-5 text-gray-500" />
        }
        <h2 className="text-xl font-semibold">Bot Status</h2>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Status</h3>
          <p className="text-sm text-gray-500">
            {isActive ? 'Running' : 'Stopped'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Auto-posting {isActive ? 'enabled' : 'disabled'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={isActive}
              onChange={onToggleActive}
              disabled={!isConnected || loading}
            />
            <div className={`
              w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
              ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
              ${(!isConnected || loading) && 'opacity-50 cursor-not-allowed'}
            `}>
              <div className={`
                w-5 h-5 rounded-full bg-white transform transition-transform duration-200 ease-in-out
                ${isActive ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
