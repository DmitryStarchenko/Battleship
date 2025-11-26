import { WebSocket, WebSocketServer } from 'ws';
import { IResponse } from '../types/response';
import { ExtendedWebSocket } from '../types/websocket';

export const sendToUser = (userIndex: number, message: IResponse, wss: WebSocketServer): void => {
  console.log(`📤 Response: ${message.type} → User: ${userIndex}`);

  const messageStr = JSON.stringify(message);
  wss.clients.forEach(client => {
    const extendedClient = client as ExtendedWebSocket;
    if (extendedClient.readyState === WebSocket.OPEN && extendedClient.userIndex === userIndex) {
      extendedClient.send(messageStr);
    }
  });
};
