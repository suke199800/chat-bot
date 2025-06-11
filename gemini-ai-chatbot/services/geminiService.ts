
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';

let ai: GoogleGenAI | null = null; // Singleton AI client

/**
 * Initializes and/or returns the GoogleGenAI client.
 * Uses a singleton pattern to avoid re-initializing the client unnecessarily.
 * @param apiKey The API key for GoogleGenAI.
 * @returns The initialized GoogleGenAI client.
 * @throws Error if API key is not provided.
 */
export const getAiClient = (apiKey: string): GoogleGenAI => {
  if (!apiKey) {
    throw new Error("API key is required to initialize GoogleGenAI client.");
  }
  if (!ai) {
    console.log("Initializing GoogleGenAI client.");
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

/**
 * Creates a new chat session with the Gemini model.
 * @param client The initialized GoogleGenAI client.
 * @param systemInstructionText The system instruction string for the chat model.
 * @param history An array of previous Content objects to start the chat with.
 * @returns A new Chat instance.
 */
export const createChatSession = (client: GoogleGenAI, systemInstructionText: string, history: Content[] = []): Chat => {
  console.log("Creating new chat session with system instruction and history length:", history.length);
  
  // The `config` object in `chats.create` can take `systemInstruction` as a string.
  return client.chats.create({
    model: GEMINI_MODEL_NAME,
    config: {
      systemInstruction: systemInstructionText,
      // Optional: Add other configurations like temperature, topK, topP if needed.
      // temperature: 0.7, 
      // topP: 0.9,
      // topK: 40,
    },
    history: history,
  });
};

/**
 * Sends a message to the chat session and returns an async iterable stream of responses.
 * @param chat The active Chat instance.
 * @param messageText The user's message text.
 * @returns A Promise that resolves to an AsyncIterable of GenerateContentResponse chunks.
 * @throws Error if the chat session is not provided or messageText is empty.
 */
export const streamChatResponse = async (
  chat: Chat,
  messageText: string
): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!chat) {
    throw new Error("Chat session is not initialized.");
  }
  if (!messageText.trim()) {
    throw new Error("Message text cannot be empty.");
  }
  console.log(`Streaming chat response for message: "${messageText}"`);
  
  // For chat.sendMessageStream, the `message` parameter is the new user input.
  // The history is managed by the `Chat` object itself.
  const stream = await chat.sendMessageStream({ message: messageText });
  return stream;
};
