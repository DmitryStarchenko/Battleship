import { httpServer } from './http_server/index.js';
import { wss } from './ws_server/index.js';
import { SERVER_CONFIG } from './ws_server/constants/server.js';

const HTTP_PORT = 8181;

if (wss) {
  console.log('WebSocket server initialized');
}

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server is running on http://localhost:${HTTP_PORT}`);
  console.log(`WebSocket server is ready on ws://localhost:${SERVER_CONFIG.WEBSOCKET_PORT}`);
});
