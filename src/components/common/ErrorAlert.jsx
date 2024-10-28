import React from 'react';

const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {error}
      <button 
        onClick={onDismiss}
        className="float-right font-bold"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorAlert;
