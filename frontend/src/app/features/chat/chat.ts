import {
  Component,
  inject,
  ChangeDetectorRef,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../core/services/chat';
import { AuthService } from '../../core/services/auth';
import { ChatMessage, ChatRoom } from '../../core/models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class ChatComponent implements OnDestroy {
  room: ChatRoom | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  loading = true;
  rideId = 0;
  private sub!: Subscription;

  @ViewChild('messagesEnd') messagesEnd!: ElementRef;

  private chatService = inject(ChatService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  get currentUser() {
    return this.auth.currentUser;
  }

  ngOnInit() {
    this.rideId = Number(this.route.snapshot.paramMap.get('rideId'));
    // Crée ou récupère la room
    this.chatService.createRoom(this.rideId).subscribe({
      next: (room) => {
        this.room = room;
        this.messages = room.messages || [];
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollBottom();
        // Connecte WebSocket
        this.chatService.connectWs(room.id);
        this.sub = this.chatService.messages$.subscribe((msg) => {
          this.messages.push(msg);
          this.cdr.detectChanges();
          this.scrollBottom();
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  send() {
    if (!this.newMessage.trim() || !this.currentUser) return;
    this.chatService.sendMessage(this.newMessage, this.currentUser.id, this.currentUser.username);
    this.newMessage = '';
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.send();
    }
  }

  scrollBottom() {
    setTimeout(() => {
      if (this.messagesEnd?.nativeElement) {
        this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }

  isOwn(msg: ChatMessage): boolean {
    return (
      msg.sender_username === this.currentUser?.username ||
      msg.sender === this.currentUser?.id ||
      msg.sender_username === this.currentUser?.username
    );
  }

  ngOnDestroy() {
    this.chatService.disconnectWs();
    if (this.sub) this.sub.unsubscribe();
  }
}
