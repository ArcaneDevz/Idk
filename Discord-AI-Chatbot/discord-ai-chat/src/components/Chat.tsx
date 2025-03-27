import { useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '../context/ChatContext';

export default function Chat() {
  const { currentChannel, isLoading } = useChat();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChannel?.messages]);

  return (
    <div className="flex h-screen flex-col">
      <ChatHeader />

      <div className="relative flex-1 overflow-hidden">
        <MessageList />
        <div ref={messageEndRef} />

        {isLoading && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="rounded-full bg-[#36393f] px-4 py-2 text-gray-300 shadow-md">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 animate-bounce rounded-full bg-indigo-500"></div>
                <span>AI is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChatInput />
    </div>
  );
}
