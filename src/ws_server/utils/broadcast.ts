import { WebSocket } from 'ws';
import { IResponse } from '../types/typesRes';

export const broadcast = (message: IResponse, sender: WebSocket, clients: WebSocket[]): void => {
  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
};
