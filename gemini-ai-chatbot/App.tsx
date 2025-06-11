
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from '@google/genai';
import { ChatMessage as ChatMessageType, MessageSender } from './types';
import { BOT_GREETING_MESSAGE, INITIAL_SYSTEM_INSTRUCTION, API_KEY_ERROR_MESSAGE, GENERIC_ERROR_MESSAGE } from './constants';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyMissingBanner from './components/ApiKeyMissingBanner';
import { getAiClient, createChatSession, streamChatResponse } from './services/geminiService';

const USER_PROVIDED_API_KEY = 'AIzaSyCp3qYBnbvKLipMt5hYqaoYYj8osuLqpbU';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | undefined>(USER_PROVIDED_API_KEY);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // User provided API key directly
    const key = USER_PROVIDED_API_KEY;
    
    setApiKey(key); // Set the state, though it's already initialized

    if (key) {
      try {
        console.log("API Key provided. Initializing AI client and chat session.");
        const client = getAiClient(key);
        const initialHistory: Content[] = []; 
        const session = createChatSession(client, INITIAL_SYSTEM_INSTRUCTION, initialHistory);
        setChatSession(session);
        setMessages([
          { 
            id: `bot-greeting-${Date.now()}`, 
            text: BOT_GREETING_MESSAGE, 
            sender: MessageSender.BOT,
            timestamp: Date.now()
          }
        ]);
        setError(null);
      } catch (e) {
        console.error("Failed to initialize chat session:", e);
        setError("챗봇 세션 초기화에 실패했습니다. API 키를 확인해주세요.");
        setChatSession(null);
      }
    } else {
      // This block should ideally not be reached if USER_PROVIDED_API_KEY is always set
      console.warn("API Key not found. Chatbot functionality will be limited.");
      setError(API_KEY_ERROR_MESSAGE);
      setMessages([]); 
      setChatSession(null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!chatSession || isLoading || !inputText.trim()) {
      if (!chatSession && apiKey) setError("챗 세션을 사용할 수 없습니다. 페이지를 새로고침 해보세요.");
      else if (!chatSession && !apiKey) setError(API_KEY_ERROR_MESSAGE); // Should not happen with hardcoded key
      return;
    }

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: MessageSender.USER,
      timestamp: Date.now()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    const botMessageId = `bot-${Date.now()}`;
    setMessages(prevMessages => [
      ...prevMessages, 
      { 
        id: botMessageId, 
        text: '', 
        sender: MessageSender.BOT, 
        timestamp: Date.now() 
      }
    ]);

    try {
      const stream = await streamChatResponse(chatSession, inputText);
      let currentBotText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text; 
        if (chunkText) {
          currentBotText += chunkText;
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === botMessageId ? { ...msg, text: currentBotText } : msg
            )
          );
        }
      }
    } catch (e: any) {
      console.error("Error sending message to Gemini:", e);
      setError(e.message || GENERIC_ERROR_MESSAGE);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== botMessageId)); 
       setMessages(prevMessages => [
        ...prevMessages, 
        { 
          id: `error-${Date.now()}`, 
          text: `오류: ${e.message || GENERIC_ERROR_MESSAGE}`, 
          sender: MessageSender.SYSTEM,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [chatSession, isLoading, apiKey]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-xl">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-center">Gemini AI 챗봇</h1>
      </header>

      {!apiKey && <ApiKeyMissingBanner message={API_KEY_ERROR_MESSAGE} />}
      {error && !isLoading && (
         <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
           <p className="font-bold">오류</p>
           <p>{error}</p>
         </div>
      )}

      <div ref={chatContainerRef} className="flex-grow p-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1]?.sender === MessageSender.USER && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-200 text-gray-700 p-3 rounded-lg rounded-bl-none max-w-xl">
              <LoadingSpinner />
              <span>답변을 생성 중입니다...</span>
            </div>
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={!chatSession || isLoading || !apiKey} />
      
      <footer className="p-2 text-center text-xs text-gray-500 border-t">
        Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;