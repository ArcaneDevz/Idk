import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Channel, ChatContextType, Message, User } from '../types';
import { generateAIResponse } from '../utils/openai';

// Create a default context
const defaultContext: ChatContextType = {
  channels: [],
  currentChannel: null,
  messages: [],
  user: { name: 'User' },
  botUser: { name: 'AI Assistant' },
  isLoading: false,
  addChannel: () => {},
  setCurrentChannel: () => {},
  sendMessage: async () => {},
};

// Create context
const ChatContext = createContext<ChatContextType>(defaultContext);

// Hook for using the chat context
export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'general', name: 'general', messages: [] },
  ]);
  const [currentChannel, setCurrentChannelState] = useState<Channel | null>(channels[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Default users
  const user: User = { name: 'User' };
  const botUser: User = { name: 'AI Assistant' };

  // Get current messages based on active channel
  const messages = currentChannel?.messages || [];

  // Initialize with a welcome message
  useEffect(() => {
    if (channels[0].messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today?",
        timestamp: new Date(),
      };

      setChannels(prev => [
        {
          ...prev[0],
          messages: [welcomeMessage],
        },
        ...prev.slice(1),
      ]);
    }
  }, []);

  // Add a new channel
  const addChannel = (name: string) => {
    const newChannel: Channel = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      messages: [],
    };

    setChannels(prev => [...prev, newChannel]);
  };

  // Set current channel
  const setCurrentChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId) || null;
    setCurrentChannelState(channel);
  };

  // Send a message and get AI response
  const sendMessage = async (content: string) => {
    if (!currentChannel) return;

    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message to channel
    const updatedChannel = {
      ...currentChannel,
      messages: [...currentChannel.messages, userMessage],
    };

    // Update channels
    setChannels(prev =>
      prev.map(c => (c.id === currentChannel.id ? updatedChannel : c))
    );

    // Update current channel
    setCurrentChannelState(updatedChannel);

    // Generate AI response
    setIsLoading(true);
    try {
      const aiContent = await generateAIResponse([...updatedChannel.messages]);

      // Create AI message
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };

      // Add AI message to channel
      const finalChannel = {
        ...updatedChannel,
        messages: [...updatedChannel.messages, aiMessage],
      };

      // Update channels
      setChannels(prev =>
        prev.map(c => (c.id === currentChannel.id ? finalChannel : c))
      );

      // Update current channel
      setCurrentChannelState(finalChannel);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: ChatContextType = {
    channels,
    currentChannel,
    messages,
    user,
    botUser,
    isLoading,
    addChannel,
    setCurrentChannel,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
