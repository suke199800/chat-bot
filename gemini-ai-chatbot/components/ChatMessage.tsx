
import React from 'react';
import { ChatMessage as ChatMessageType, MessageSender, GroundingSource } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  const isBot = message.sender === MessageSender.BOT;
  const isSystem = message.sender === MessageSender.SYSTEM;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  if (isSystem) {
    return (
      <div className="my-2 text-center text-xs text-gray-500 italic">
        {message.text} ({formatDate(message.timestamp)})
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end max-w-xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {isBot && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-7.5h12c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125h-12c-.621 0-1.125.504-1.125 1.125v3.75c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
        )}
         {isUser && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-lg shadow ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text || (isBot && "...")}</p>
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <p className="text-xs font-semibold mb-1">참고 자료:</p>
              <ul className="list-disc list-inside space-y-1">
                {message.sources.map((source: GroundingSource, index: number) => (
                  <li key={index} className="text-xs">
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hover:underline ${isUser ? 'text-blue-200' : 'text-indigo-600'}`}
                    >
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-200 text-right' : 'text-gray-500 text-left'}`}>
            {formatDate(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
