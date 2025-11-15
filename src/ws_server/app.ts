import { attack } from './components/attack';
import { createRoom } from './components/create_room';
import { addUserToRoom } from './components/add_user_to_room';
import { reg } from './components/reg';
import { updateRoom } from './components/update_room';
import { IRequest, IAddShips } from './types/typesReq';
import { ExtendedWebSocket } from './types/websocket';
import { broadcast } from './utils/broadcast';
import { sendToUser } from './utils/sendToUser';
import { WebSocketServer } from 'ws';
import {
  createGameSession,
  addShipsToGame,
  bothPlayersReady,
  getGameSession,
} from './utils/gameStorage';

export const app = async (req: IRequest, ws: ExtendedWebSocket, wss: WebSocketServer) => {
  let response;

  switch (req.type) {
    case 'reg':
      response = await reg(JSON.parse(req.data.toString()));
      if (response && typeof response.data === 'string') {
        const regData = JSON.parse(response.data);
        if (!regData.error && regData.index) {
          ws.userIndex = regData.index;
        }
        ws.send(JSON.stringify(response));
        const updateRoomResponse = await updateRoom();
        ws.send(JSON.stringify(updateRoomResponse));
      }
      return null;

    case 'create_room':
      if (ws.userIndex !== undefined) {
        await createRoom(ws.userIndex);
        const updateRoomResponse = await updateRoom();
        broadcast(updateRoomResponse, wss);
      }
      return null;

    case 'add_user_to_room':
      if (ws.userIndex !== undefined) {
        response = await addUserToRoom(JSON.parse(req.data.toString()), ws.userIndex);
        if (response && response.data) {
          const roomData = JSON.parse(response.data as string);
          if (roomData && roomData.roomUsers && roomData.roomUsers.length === 2) {
            const playerIndexes = roomData.roomUsers.map((u: { index: number }) => u.index);
            const gameSession = createGameSession(roomData.roomId, playerIndexes);

            playerIndexes.forEach((playerIndex: number) => {
              const player = gameSession.players.find(p => p.index === playerIndex);
              if (player) {
                sendToUser(
                  playerIndex,
                  {
                    type: 'create_game',
                    data: JSON.stringify({
                      idGame: gameSession.idGame,
                      idPlayer: player.idPlayer,
                    }),
                    id: 0,
                  },
                  wss
                );
              }
            });
          }

          const updateRoomResponse = await updateRoom();
          broadcast(updateRoomResponse, wss);
        }
      }
      return null;

    case 'add_ships':
      if (ws.userIndex !== undefined) {
        const shipsData = JSON.parse(req.data.toString()) as IAddShips;
        const gameId = Number(shipsData.gameId);

        addShipsToGame(gameId, ws.userIndex, shipsData.ships);

        if (bothPlayersReady(gameId)) {
          const gameSession = getGameSession(gameId);
          if (gameSession) {
            gameSession.players.forEach(player => {
              if (player.ships) {
                sendToUser(
                  player.index,
                  {
                    type: 'start_game',
                    data: JSON.stringify({
                      ships: player.ships,
                      currentPlayerIndex: player.index,
                    }),
                    id: 0,
                  },
                  wss
                );
              }
            });
          }
        }
      }
      return null;

    case 'attack':
      response = attack(JSON.parse(req.data.toString()));
      break;

    default:
      console.log('An unrecognized request was received');
      break;
  }

  return response;
};
