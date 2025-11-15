import { WebSocketServer, WebSocket } from 'ws';
import { app } from './app';
import { userLogout } from './utils/userLogout';
import { ExtendedWebSocket } from './types/websocket';

export const WEBSOCKET_PORT = 3000;

export const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

wss.on('connection', function connection(ws: WebSocket) {
  console.log(`New WebSocket connection established`);

  ws.on('message', async message => {
    console.log(JSON.parse(message.toString()));
    const req = JSON.parse(message.toString());

    if (req.type === 'reg') {
      await app(req, ws as ExtendedWebSocket, wss);
    } else {
      const res = await app(req, ws as ExtendedWebSocket, wss);
      if (res) {
        ws.send(JSON.stringify(res));
      }
    }
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
