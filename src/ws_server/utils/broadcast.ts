import { WebSocket, WebSocketServer } from 'ws';
import { IResponse } from '../types/response';

export const broadcast = (message: IResponse, wss: WebSocketServer): void => {
  console.log(`📢 Broadcast: ${message.type} → All users`);

  const messageStr = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
};
