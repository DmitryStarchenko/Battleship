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
  handleSinglePlay,
} from './handlers';
import { getGameSession, getPlayerByIdPlayer } from './utils/gameStorage';

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
        await handleAddShips(req.data.toString(), ws.userIndex, wss);
      }
      break;

    case 'attack':
      if (ws.userIndex !== undefined) {
        const attackData = JSON.parse(req.data.toString());
        const gameId = Number(attackData.gameId);
        const attackerIdPlayer = Number(attackData.indexPlayer);

        const gameSession = getGameSession(gameId);
        if (gameSession) {
          const attacker = getPlayerByIdPlayer(gameId, attackerIdPlayer);
          if (attacker && attacker.index === gameSession.currentPlayerIndex) {
            const result = attack(attackData);
            await handleAttackResult(result, gameId, wss);
          }
        }
      }
      break;

    case 'randomAttack':
      if (ws.userIndex !== undefined) {
        const randomAttackData = JSON.parse(req.data.toString());
        const gameId = Number(randomAttackData.gameId);
        const attackerIdPlayer = Number(randomAttackData.indexPlayer);

        const gameSession = getGameSession(gameId);
        if (gameSession) {
          const attacker = getPlayerByIdPlayer(gameId, attackerIdPlayer);
          if (attacker && attacker.index === gameSession.currentPlayerIndex) {
            const result = randomAttack(randomAttackData);
            await handleAttackResult(result, gameId, wss);
          }
        }
      }
      break;

    case 'single_play':
      if (ws.userIndex !== undefined) {
        handleSinglePlay(ws.userIndex, ws);
      }
      break;

    default:
      console.log('An unrecognized request was received');
      break;
  }
};
