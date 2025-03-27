import { useChat } from '../context/ChatContext';
import { formatDistanceToNow } from '../utils/date';

export default function MessageList() {
  const { messages, user, botUser } = useChat();

  return (
    <div className="flex-1 overflow-y-auto bg-[#36393f] p-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-400">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isUserMessage = message.role === 'user';
            const displayName = isUserMessage ? user.name : botUser.name;
            const avatarBg = isUserMessage ? 'bg-blue-500' : 'bg-purple-500';

            return (
              <div key={message.id} className="group flex items-start">
                <div className={`mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${avatarBg}`}>
                  {displayName.charAt(0)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-2 font-medium text-white">{displayName}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(message.timestamp)}
                    </span>
                  </div>

                  <div className="mt-1 text-gray-300 whitespace-pre-wrap">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
