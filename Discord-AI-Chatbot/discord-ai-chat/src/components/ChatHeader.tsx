import { useChat } from '../context/ChatContext';
import { HashtagIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon, BellIcon, QuestionMarkCircleIcon, InboxIcon } from '@heroicons/react/24/outline';

export default function ChatHeader() {
  const { currentChannel } = useChat();

  return (
    <div className="flex h-12 items-center justify-between border-b border-gray-800 bg-[#36393f] px-4 shadow-sm">
      <div className="flex items-center">
        <HashtagIcon className="mr-2 h-5 w-5 text-gray-400" />
        <h2 className="text-white">{currentChannel?.name || 'No channel selected'}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-200 hover:text-white">
          <BellIcon className="h-5 w-5" />
        </button>
        <button className="text-gray-200 hover:text-white">
          <InboxIcon className="h-5 w-5" />
        </button>
        <button className="text-gray-200 hover:text-white">
          <UserGroupIcon className="h-5 w-5" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-36 rounded bg-[#202225] px-2 py-1 text-sm text-gray-200 placeholder-gray-400 outline-none"
          />
          <MagnifyingGlassIcon className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        <button className="text-gray-200 hover:text-white">
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
