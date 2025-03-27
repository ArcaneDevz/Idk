import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function Sidebar() {
  const { channels, currentChannel, setCurrentChannel, addChannel } = useChat();
  const [newChannelName, setNewChannelName] = useState('');
  const [isAddingChannel, setIsAddingChannel] = useState(false);

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      addChannel(newChannelName.trim());
      setNewChannelName('');
      setIsAddingChannel(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddChannel();
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-[#2f3136] text-gray-300">
      <div className="flex h-12 items-center justify-between border-b border-gray-800 p-4 shadow-sm">
        <h1 className="text-lg font-semibold text-white">AI Discord</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Text Channels
          </h2>
          <button
            className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white"
            onClick={() => setIsAddingChannel(true)}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Channel list */}
        <div className="space-y-1">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className={`flex w-full items-center rounded px-2 py-1 text-left ${
                currentChannel?.id === channel.id
                  ? 'bg-[#393c43] text-white'
                  : 'hover:bg-[#36393f] hover:text-gray-100'
              }`}
              onClick={() => setCurrentChannel(channel.id)}
            >
              <span className="mr-1 text-gray-400">#</span>
              <span className="truncate">{channel.name}</span>
            </button>
          ))}

          {/* Add channel input */}
          {isAddingChannel && (
            <div className="flex items-center rounded bg-[#36393f] px-2 py-1">
              <span className="mr-1 text-gray-400">#</span>
              <input
                type="text"
                className="w-full bg-transparent text-sm text-white outline-none"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="new-channel"
                autoFocus
                onBlur={() => {
                  handleAddChannel();
                  setIsAddingChannel(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* User area */}
      <div className="flex h-14 items-center justify-between bg-[#292b2f] p-2">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-blue-500"></div>
          <div className="text-sm font-medium">User</div>
        </div>
      </div>
    </div>
  );
}
