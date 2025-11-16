import { IRequest } from './types/request';
import { ExtendedWebSocket } from './types/websocket';
import { WebSocketServer } from 'ws';
import {
  handleReg,
  handleCreateRoom,
  handleAddUserToRoom,
  handleAddShips,
  handleAttackRequest,
  handleRandomAttackRequest,
  handleSinglePlay,
} from './handlers';

type RequestHandler = (
  data: string,
  userIndex: number,
  wss: WebSocketServer
) => Promise<void> | void;

const requiresAuth = (
  ws: ExtendedWebSocket,
  handler: RequestHandler,
  data: string,
  wss: WebSocketServer
): void => {
  if (ws.userIndex !== undefined) {
    handler(data, ws.userIndex, wss);
  }
};

export const app = async (req: IRequest, ws: ExtendedWebSocket, wss: WebSocketServer) => {
  const data = req.data.toString();

  switch (req.type) {
    case 'reg':
      await handleReg(data, ws);
      break;

    case 'create_room':
      requiresAuth(ws, (_, userIndex, wss) => handleCreateRoom(userIndex, wss), data, wss);
      break;

    case 'add_user_to_room':
      requiresAuth(ws, handleAddUserToRoom, data, wss);
      break;

    case 'add_ships':
      requiresAuth(ws, handleAddShips, data, wss);
      break;

    case 'attack':
      requiresAuth(ws, (data, _, wss) => handleAttackRequest(data, wss), data, wss);
      break;

    case 'randomAttack':
      requiresAuth(ws, (data, _, wss) => handleRandomAttackRequest(data, wss), data, wss);
      break;

    case 'single_play':
      requiresAuth(ws, (_, userIndex) => handleSinglePlay(userIndex, ws), data, wss);
      break;

    default:
      console.log(`Unrecognized request type: ${req.type}`);
      break;
  }
};
