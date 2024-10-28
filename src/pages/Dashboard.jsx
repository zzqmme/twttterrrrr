import React, { useState, useEffect } from 'react';
import ConfigurationCard from '../components/dashboard/Config';
import TwitterCard from '../components/dashboard/Twitter';
import StatusCard from '../components/dashboard/Status';
import ErrorAlert from '../components/common/ErrorAlert';
import { useBotApi } from '../hooks/useApi';

function Dashboard() {
  // State management
  const [botState, setBotState] = useState({
    name: 'My Bot',
    systemPrompt: '',
    interval: 60,
    isActive: false,
    isConnected: false,
    twitterUsername: null,
    botCreated: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { callApi } = useBotApi();

  // Fetch initial bot data
  useEffect(() => {
    async function fetchBot() {
      try {
        const bot = await callApi('/bots/my');
        setBotState({
          name: bot.name,
          systemPrompt: bot.system_prompt,
          interval: bot.post_interval,
          isActive: bot.is_active,
          isConnected: !!bot.twitter_account_id,
          twitterUsername: bot.twitter_account_id,
          botCreated: true
        });
      } catch (err) {
        if (err.message !== 'No bot found for this browser') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchBot();
  }, []);

  // Handler functions remain the same as in your original code
  const handleSave = async () => {
    try {
      setLoading(true);
      if (botState.botCreated) {
        await callApi('/bots/my', {
          method: 'PATCH',
          body: JSON.stringify({
            name: botState.name,
            system_prompt: botState.systemPrompt,
            post_interval: botState.interval,
          }),
        });
      } else {
        await callApi('/bots', {
          method: 'POST',
          body: JSON.stringify({
            name: botState.name,
            system_prompt: botState.systemPrompt,
            post_interval: botState.interval
          })
        });
        setBotState(prev => ({ ...prev, botCreated: true }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterConnect = async () => {
    if (botState.isConnected) {
      try {
        setLoading(true);
        await callApi('/bots/my', {
          method: 'PATCH',
          body: JSON.stringify({
            twitter_credentials: null,
            twitter_account_id: null
          })
        });
        setBotState(prev => ({
          ...prev,
          isConnected: false,
          twitterUsername: null
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await callApi('/twitter/auth');
        
        const width = 600;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        const popup = window.open(
          response.auth_url,
          'twitter-auth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
        
        window.addEventListener('message', async (event) => {
          if (event.data.type === 'TWITTER_CALLBACK') {
            popup.close();
            try {
              const result = await callApi(`/twitter/callback?${new URLSearchParams({
                oauth_token: event.data.oauth_token,
                oauth_verifier: event.data.oauth_verifier
              })}`);
              
              setBotState(prev => ({
                ...prev,
                isConnected: true,
                twitterUsername: result.username
              }));
            } catch (err) {
              setError(err.message);
            }
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async () => {
    try {
      setLoading(true);
      await callApi(`/bots/my/${botState.isActive ? 'deactivate' : 'activate'}`, { 
        method: 'POST' 
      });
      setBotState(prev => ({ ...prev, isActive: !prev.isActive }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StepTransition = ({ show, message }) => (
    <div className={`transition-all duration-500 ease-in-out ${show ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
      <div className="border-l-4 border-blue-500 pl-4 my-6 py-2 text-gray-600">
        {message}
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ErrorAlert error={error} onDismiss={() => setError(null)} />
      
      <h1 className="text-3xl font-bold mb-6">Make ur AI meme</h1>

      <h3 className="text-gl mb-6">
        Deploy the most important part of your AI meme - the utility - with ease <br />
        Then launch on pump fun 
      </h3>
      
      <div className="space-y-6">
        <ConfigurationCard
          botName={botState.name}
          setBotName={(name) => setBotState(prev => ({ ...prev, name }))}
          systemPrompt={botState.systemPrompt}
          setSystemPrompt={(prompt) => setBotState(prev => ({ ...prev, systemPrompt: prompt }))}
          interval={botState.interval}
          setInterval={(interval) => setBotState(prev => ({ ...prev, interval }))}
          onSave={handleSave}
          isBotCreated={botState.botCreated}
          loading={loading}
        />

        <StepTransition 
          show={!botState.botCreated} 
          message="👆 First, configure and save your bot settings to continue" 
        />

        {botState.botCreated && (
          <>
            <TwitterCard
              isConnected={botState.isConnected}
              twitterUsername={botState.twitterUsername}
              onTwitterConnect={handleTwitterConnect}
              loading={loading}
            />

            <StepTransition 
              show={!botState.isConnected} 
              message="👆 Connect your Twitter account to activate your bot" 
            />

            {botState.isConnected && (
              <StatusCard
                isActive={botState.isActive}
                isConnected={botState.isConnected}
                onToggleActive={handleToggleActive}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;