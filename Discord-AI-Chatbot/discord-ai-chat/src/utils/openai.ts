import OpenAI from 'openai';
import { Message } from '../types';

// Define proper types for OpenAI messages
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Create OpenAI client with appropriate authentication
function createOpenAIClient(apiKey: string, baseURL: string) {
  if (!apiKey) {
    throw new Error('Missing API key. Please provide an API key.');
  }

  // Adapt GitHub token for use with OpenAI-compatible endpoints
  // This assumes the endpoint is configured to accept GitHub tokens
  let effectiveKey = apiKey;
  const effectiveBaseURL = baseURL;

  // If using a GitHub token with Azure endpoint
  if (apiKey.startsWith('ghp_') && baseURL.includes('inference.ai.azure.com')) {
    // Pass the GitHub token as-is - the Azure endpoint may be configured to accept it
    console.log('Using GitHub token with Azure endpoint');
    effectiveKey = apiKey;
  }
  // If using GitHub token with standard OpenAI endpoint (which won't work)
  else if (apiKey.startsWith('ghp_') && baseURL.includes('api.openai.com')) {
    // This won't work with standard OpenAI, so warn the user
    console.warn('GitHub tokens are not compatible with standard OpenAI API');
    throw new Error('GitHub tokens (ghp_*) cannot be used with the standard OpenAI API. Please use an Azure endpoint that supports GitHub tokens or provide an OpenAI API key.');
  }

  return new OpenAI({
    apiKey: effectiveKey,
    baseURL: effectiveBaseURL,
    dangerouslyAllowBrowser: true, // Only for demo purposes
  });
}

export async function generateAIResponse(messages: Message[]): Promise<string> {
  try {
    // Get settings from localStorage or environment variables
    const savedSettings = localStorage.getItem('discord_ai_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};

    const apiKey = settings.apiKey || import.meta.env.VITE_OPENAI_API_KEY || '';
    const baseURL = settings.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1';
    const model = settings.model || import.meta.env.VITE_MODEL || 'gpt-4o';

    // Create OpenAI client
    const openai = createOpenAIClient(apiKey, baseURL);

    // Format messages for OpenAI
    const formattedMessages: OpenAIMessage[] = messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    }));

    // Add system message if not present
    if (!formattedMessages.find(msg => msg.role === 'system')) {
      formattedMessages.unshift({
        role: 'system',
        content: 'You are a helpful AI assistant in a Discord-like chat interface. Be conversational, helpful, and concise in your responses.',
      });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      messages: formattedMessages,
      model: model,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error: unknown) {
    console.error('Error generating AI response:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('API key')) {
      if (errorMessage.includes('GitHub token')) {
        return 'Error: GitHub tokens can only be used with specific Azure endpoints configured to accept them. If you are using a GitHub token, make sure your API Base URL is set to the correct Azure endpoint.';
      }
      return 'API key error: Please check that you\'ve entered a valid API key.';
    }

    if (errorMessage.includes('API request failed')) {
      return 'API request failed. This could be because the API endpoint is not configured to accept the provided authentication token. Please verify your API key and base URL settings.';
    }

    return `Error: ${errorMessage || 'Unknown error occurred. Please check your API key and connection settings.'}`;
  }
}
