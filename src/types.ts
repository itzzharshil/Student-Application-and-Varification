export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  references?: Array<{
    title: string;
    url?: string;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}
