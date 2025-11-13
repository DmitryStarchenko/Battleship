import { WebSocketServer } from 'ws';
import { app } from './app';

export const WEBSOCKET_PORT = 3000;

const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection established');

  ws.on('message', async message => {
    const res = await app(JSON.parse(message.toString()));
    ws.send(JSON.stringify(res));
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });
});
