export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Channel {
  id: string;
  name: string;
  messages: Message[];
}

export interface User {
  name: string;
  avatar?: string;
}

export interface ChatContextType {
  channels: Channel[];
  currentChannel: Channel | null;
  messages: Message[];
  user: User;
  botUser: User;
  isLoading: boolean;
  addChannel: (name: string) => void;
  setCurrentChannel: (channelId: string) => void;
  sendMessage: (content: string) => Promise<void>;
}
