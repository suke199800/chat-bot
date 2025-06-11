
export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system',
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  sources?: GroundingSource[];
  timestamp: number;
}
