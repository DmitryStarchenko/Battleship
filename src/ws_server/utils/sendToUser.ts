import { WebSocket, WebSocketServer } from 'ws';
import { IResponse } from '../types/typesRes';
import { ExtendedWebSocket } from '../types/websocket';

export const sendToUser = (userIndex: number, message: IResponse, wss: WebSocketServer): void => {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach(client => {
    const extendedClient = client as ExtendedWebSocket;
    if (extendedClient.readyState === WebSocket.OPEN && extendedClient.userIndex === userIndex) {
      extendedClient.send(messageStr);
    }
  });
};
