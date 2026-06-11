export interface ChatMessage {
  id?: number;
  sender: number;
  sender_username: string;
  content: string;
  created_at?: string;
}

export interface ChatRoom {
  id: number;
  ride_id: number;
  messages: ChatMessage[];
  created_at: string;
}
