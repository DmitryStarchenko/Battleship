import { WebSocketServer, WebSocket } from 'ws';
import { app } from './app';
import { userLogout } from './utils/userLogout';

export const WEBSOCKET_PORT = 3000;

const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

interface ExtendedWebSocket extends WebSocket {
  userIndex?: number;
}

wss.on('connection', function connection(ws: WebSocket) {
  console.log(`New WebSocket connection established`);

  ws.on('message', async message => {
    console.log(JSON.parse(message.toString()));
    const req = JSON.parse(message.toString());
    const res = await app(req);

    if (req.type === 'reg' && res?.type === 'reg' && typeof res.data === 'string') {
      const regData = JSON.parse(res.data);
      if (!regData.error && regData.index) {
        (ws as ExtendedWebSocket).userIndex = regData.index;
      }
    }

    ws.send(JSON.stringify(res));
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
