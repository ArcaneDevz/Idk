import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PaperAirplaneIcon, PlusCircleIcon, GiftIcon, FaceSmileIcon } from '@heroicons/react/24/solid';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading, currentChannel } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() && !isLoading) {
      setMessage('');
      await sendMessage(message);
    }
  };

  const isDisabled = !currentChannel || isLoading;

  return (
    <div className="p-4 bg-[#36393f]">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          <button
            type="button"
            disabled={isDisabled}
            className="absolute left-2 p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50"
          >
            <PlusCircleIcon className="h-6 w-6" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isDisabled}
            placeholder={
              !currentChannel
                ? 'Select a channel to start chatting'
                : isLoading
                ? 'Waiting for response...'
                : `Message #${currentChannel.name}`
            }
            className="w-full rounded-md bg-[#40444b] py-2 pl-10 pr-16 text-gray-200 placeholder-gray-400 outline-none disabled:opacity-50"
          />

          <div className="absolute right-2 flex space-x-2">
            <button
              type="button"
              disabled={isDisabled}
              className="p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50"
            >
              <GiftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={isDisabled}
              className="p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50"
            >
              <FaceSmileIcon className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={isDisabled || !message.trim()}
              className="p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
