import { httpServer } from './http_server/index.js';
import { WEBSOCKET_PORT } from './ws_server/index.js';

const HTTP_PORT = 8181;

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server is running on http://localhost:${HTTP_PORT}`);
  console.log(`WebSocket server is ready on ws://localhost:${WEBSOCKET_PORT}`);
});
