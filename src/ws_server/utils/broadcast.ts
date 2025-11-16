import { WebSocket, WebSocketServer } from 'ws';
import { IResponse } from '../types/typesRes';

export const broadcast = (message: IResponse, wss: WebSocketServer): void => {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
};
