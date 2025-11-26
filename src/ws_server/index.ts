import { WebSocketServer, WebSocket } from 'ws';
import { app } from './app';
import { userLogout } from './utils/userLogout';
import { ExtendedWebSocket } from './types/websocket';
import { SERVER_CONFIG } from './constants/server';

export const wss = new WebSocketServer({ port: SERVER_CONFIG.WEBSOCKET_PORT });

wss.on('connection', function connection(ws: WebSocket) {
  console.log(`New WebSocket connection established`);

  ws.on('message', async message => {
    const req = JSON.parse(message.toString());
    await app(req, ws, wss);
  });

  ws.on('close', async function close() {
    const userIndex = (ws as ExtendedWebSocket).userIndex;
    if (userIndex !== undefined) {
      await userLogout(userIndex);
    }
    console.log('WebSocket connection closed');
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });
});
