import { attack } from './components/attack';
import { randomAttack } from './components/randomAttack';
import { IRequest } from './types/typesReq';
import { ExtendedWebSocket } from './types/websocket';
import { WebSocketServer } from 'ws';
import {
  handleReg,
  handleCreateRoom,
  handleAddUserToRoom,
  handleAddShips,
  handleAttackResult,
} from './handlers';

export const app = async (req: IRequest, ws: ExtendedWebSocket, wss: WebSocketServer) => {
  switch (req.type) {
    case 'reg':
      await handleReg(req.data.toString(), ws);
      break;

    case 'create_room':
      if (ws.userIndex !== undefined) {
        await handleCreateRoom(ws.userIndex, wss);
      }
      break;

    case 'add_user_to_room':
      if (ws.userIndex !== undefined) {
        await handleAddUserToRoom(req.data.toString(), ws.userIndex, wss);
      }
      break;

    case 'add_ships':
      if (ws.userIndex !== undefined) {
        handleAddShips(req.data.toString(), ws.userIndex, wss);
      }
      break;

    case 'attack':
      if (ws.userIndex !== undefined) {
        const attackData = JSON.parse(req.data.toString());
        const result = attack(attackData);
        await handleAttackResult(result, Number(attackData.gameId), wss);
      }
      break;

    case 'randomAttack':
      if (ws.userIndex !== undefined) {
        const randomAttackData = JSON.parse(req.data.toString());
        const result = randomAttack(randomAttackData);
        await handleAttackResult(result, Number(randomAttackData.gameId), wss);
      }
      break;

    default:
      console.log('An unrecognized request was received');
      break;
  }
};
