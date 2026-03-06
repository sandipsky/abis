import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _socket$: WebSocketSubject<any> = webSocket('ws://your-backend-url.com/notifications');

  getNotifications(): Observable<any> {
    return this._socket$.asObservable();
  }

  send(data: any) {
    this._socket$.next(data);
  }

  close() {
    this._socket$.complete();
  }
}