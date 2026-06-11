import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { API } from '../constants/api';
import { ChatRoom, ChatMessage } from '../models/chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<ChatMessage>();
  messages$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(API.chat.rooms);
  }

  getRoom(id: number): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(API.chat.room(id));
  }

  createRoom(rideId: number): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(API.chat.rooms, { ride_id: rideId });
  }

  getMessages(roomId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(API.chat.messages(roomId));
  }

  connectWs(roomId: number) {
    this.disconnectWs();
    this.ws = new WebSocket(API.chat.ws(roomId));
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data);
    };
  }

  sendMessage(content: string, userId: number, username: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ content, user_id: userId, username }));
    }
  }

  disconnectWs() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
