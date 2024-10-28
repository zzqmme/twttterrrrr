import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function TwitterCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');
    
    if (oauth_token && oauth_verifier) {
      // Send message to opener window
      if (window.opener) {
        window.opener.postMessage({
          type: 'TWITTER_CALLBACK',
          oauth_token,
          oauth_verifier
        }, '*');
        // Close popup after sending message
        window.close();
      } else {
        // If opened directly (not in popup), redirect back to dashboard
        navigate('/');
      }
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Connecting to Twitter...</p>
      </div>
    </div>
  );
}

export default TwitterCallback;