import { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  apiBaseUrl: string;
  model: string;
  onSave: (settings: { apiKey: string; apiBaseUrl: string; model: string }) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  apiBaseUrl,
  model,
  onSave,
}: SettingsModalProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localApiBaseUrl, setLocalApiBaseUrl] = useState(apiBaseUrl);
  const [localModel, setLocalModel] = useState(model);
  const [error, setError] = useState<string | null>(null);
  const [isGitHubToken, setIsGitHubToken] = useState(apiKey?.startsWith('ghp_') || false);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalApiKey(apiKey);
      setLocalApiBaseUrl(apiBaseUrl);
      setLocalModel(model);
      setIsGitHubToken(apiKey?.startsWith('ghp_') || false);
      setError(null);
    }
  }, [isOpen, apiKey, apiBaseUrl, model]);

  // Check if key is a GitHub token and update state
  useEffect(() => {
    setIsGitHubToken(localApiKey?.startsWith('ghp_') || false);
  }, [localApiKey]);

  const validateSettings = () => {
    if (!localApiKey) {
      setError('API key is required');
      return false;
    }

    // If GitHub token, make sure Azure endpoint is used
    if (localApiKey.startsWith('ghp_')) {
      if (!localApiBaseUrl.includes('inference.ai.azure.com')) {
        setError('GitHub tokens can only be used with Azure endpoints (inference.ai.azure.com). Please update your API Base URL.');
        return false;
      }
    }

    if (!localApiBaseUrl) {
      setError('API base URL is required');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateSettings()) {
      onSave({
        apiKey: localApiKey,
        apiBaseUrl: localApiBaseUrl,
        model: localModel,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-md rounded-md bg-[#36393f] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Settings</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-500 bg-opacity-20 p-3 text-red-200">
            <p>{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            API Key <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            className="w-full rounded-md bg-[#40444b] p-2 text-white"
            placeholder="Enter your API key"
          />

          {isGitHubToken ? (
            <div className="mt-1 rounded-md bg-yellow-500 bg-opacity-20 p-2 text-yellow-200 text-xs">
              <p className="font-semibold">⚠️ GitHub token detected</p>
              <p>GitHub tokens only work with Azure-hosted endpoints at inference.ai.azure.com.</p>
              <p>Ensure your API Base URL is set to an Azure endpoint that accepts GitHub tokens.</p>
            </div>
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              You can use either an OpenAI API key (starting with "sk-") or a GitHub token (starting with "ghp_"),
              but GitHub tokens only work with specific Azure endpoints.
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            API Base URL <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={localApiBaseUrl}
            onChange={(e) => setLocalApiBaseUrl(e.target.value)}
            className="w-full rounded-md bg-[#40444b] p-2 text-white"
            placeholder={isGitHubToken ? "https://models.inference.ai.azure.com" : "https://api.openai.com/v1"}
          />
          <p className="mt-1 text-xs text-gray-400">
            {isGitHubToken
              ? "For GitHub tokens, use Azure endpoint: https://models.inference.ai.azure.com"
              : "For standard OpenAI keys: https://api.openai.com/v1 or your Azure endpoint."}
          </p>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Model
          </label>
          <select
            value={localModel}
            onChange={(e) => setLocalModel(e.target.value)}
            className="w-full rounded-md bg-[#40444b] p-2 text-white"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md bg-[#4f545c] px-4 py-2 text-white hover:bg-[#5d6269]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
