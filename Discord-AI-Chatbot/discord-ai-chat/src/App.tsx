import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import SettingsModal from './components/SettingsModal';
import { ChatProvider } from './context/ChatContext';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

function App() {
  const defaultApiBaseUrl = 'https://api.openai.com/v1';

  const [settings, setSettings] = useState({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl,
    model: import.meta.env.VITE_MODEL || 'gpt-4o',
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfigured, setIsConfigured] = useState(!!settings.apiKey);
  const [showWelcome, setShowWelcome] = useState(true);

  // Check if API key is available on mount
  useEffect(() => {
    if (!settings.apiKey) {
      setIsSettingsOpen(true);
    }
  }, [settings.apiKey]);

  // Save settings to localStorage
  useEffect(() => {
    if (settings.apiKey) {
      localStorage.setItem('discord_ai_settings', JSON.stringify(settings));
      setIsConfigured(true);
      setShowWelcome(false);
    }
  }, [settings]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('discord_ai_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        setIsConfigured(!!parsedSettings.apiKey);
        setShowWelcome(false);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // Update environment variables for OpenAI client
  useEffect(() => {
    if (settings.apiKey) {
      window.localStorage.setItem('OPENAI_API_KEY', settings.apiKey);
    }
  }, [settings.apiKey]);

  const handleSaveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
  };

  return (
    <ChatProvider>
      <div className="flex h-screen overflow-hidden bg-[#36393f] text-white">
        <Sidebar />

        <div className="relative flex-1">
          <Chat />

          {/* Settings button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute bottom-4 right-4 rounded-full bg-gray-700 p-3 shadow-lg hover:bg-gray-600"
          >
            <Cog6ToothIcon className="h-6 w-6 text-white" />
          </button>

          {/* Welcome message overlay */}
          {showWelcome && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80">
              <div className="w-full max-w-lg rounded-lg bg-[#36393f] p-8 shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-white">Welcome to AI Discord Chat!</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    To get started, you'll need to provide an API key. You can use either an OpenAI API key
                    or a GitHub token with Azure.
                  </p>
                  <div className="space-y-4">
                    <div className="rounded-md bg-blue-500 bg-opacity-20 p-4 text-blue-200">
                      <h3 className="mb-2 font-semibold">Option 1: OpenAI API Key</h3>
                      <ul className="list-inside list-disc space-y-1">
                        <li>OpenAI API keys start with "sk-"</li>
                        <li>Can be used with the standard OpenAI API</li>
                        <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI's website</a> to get an API key</li>
                        <li>Use API Base URL: https://api.openai.com/v1</li>
                      </ul>
                    </div>

                    <div className="rounded-md bg-purple-500 bg-opacity-20 p-4 text-purple-200">
                      <h3 className="mb-2 font-semibold">Option 2: GitHub Token with Azure</h3>
                      <ul className="list-inside list-disc space-y-1">
                        <li>GitHub tokens start with "ghp_"</li>
                        <li>Can only be used with specific Azure endpoints</li>
                        <li>Use API Base URL: https://models.inference.ai.azure.com</li>
                        <li>For token that works with GitHub-hosted models</li>
                      </ul>
                    </div>
                  </div>
                  <p>
                    Your credentials are stored only in your browser's local storage and are only sent to the API endpoint you specify.
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="mt-6 w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700"
                >
                  Configure API Settings
                </button>
              </div>
            </div>
          )}
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => isConfigured && setIsSettingsOpen(false)}
          apiKey={settings.apiKey}
          apiBaseUrl={settings.apiBaseUrl}
          model={settings.model}
          onSave={handleSaveSettings}
        />
      </div>
    </ChatProvider>
  );
}

export default App;
