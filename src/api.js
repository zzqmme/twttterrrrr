
import { useWeb3 } from './contexts/Web3Context';

const API_BASE_URL = 'https://twitter-ai-backend-b805ba3ec401.herokuapp.com/api';

// Create a singleton to store the current wallet address

const accounts = await window.ethereum.request({ 
    method: 'eth_accounts' 
});

let currentWalletAddress = accounts[0];

// Helper function to get the current fingerprint
function getFingerprint() {
  if (!currentWalletAddress) {
    throw new Error('Wallet not connected. Please connect your wallet first.');
  }
  return currentWalletAddress.toLowerCase(); // Normalize the address case
}

export async function fetchApi(endpoint, options = {}) {
  const fingerprint = getFingerprint();
  
  // Add fingerprint to query parameters
  const separator = endpoint.includes('?') ? '&' : '?';
  const urlWithFingerprint = `${API_BASE_URL}${endpoint}${separator}fingerprint=${fingerprint}`;

  // Create a new options object with the default headers
  const enhancedOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'fingerprint': fingerprint,
      ...options.headers,
    },
  };

  // If there's a body, ensure it includes both fingerprint and id
  if (options.body) {
    try {
      // Parse the body if it's a JSON string
      const bodyData = typeof options.body === 'string' 
        ? JSON.parse(options.body) 
        : options.body;

      // Add fingerprint and id
      const enhancedBody = {
        ...bodyData,
        fingerprint: fingerprint,
        id: fingerprint // Using wallet address as id
      };
        
      // Convert back to JSON string
      enhancedOptions.body = JSON.stringify(enhancedBody);
    } catch (error) {
      console.error('Error processing request body:', error);
      throw new Error('Invalid JSON in request body');
    }
  }

  // Make the API call
  const response = await fetch(urlWithFingerprint, enhancedOptions);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      Array.isArray(error.detail) 
        ? error.detail.map(e => e.msg).join(', ') 
        : error.detail || 'API call failed'
    );
  }

  return response.json();
}