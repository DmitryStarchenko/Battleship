import { IAddShips } from '../types/typesReq';
import { addShipsToGame, bothPlayersReady, getGameSession } from '../utils/gameStorage';
import { sendToUser } from '../utils/sendToUser';
import { createStartGameResponse, createTurnResponse } from '../utils/responseFactory';
import { WebSocketServer } from 'ws';

export const handleAddShips = (data: string, userIndex: number, wss: WebSocketServer): void => {
  const shipsData = JSON.parse(data) as IAddShips;
  const gameId = Number(shipsData.gameId);

  addShipsToGame(gameId, userIndex, shipsData.ships);

  if (bothPlayersReady(gameId)) {
    const gameSession = getGameSession(gameId);
    if (gameSession) {
      gameSession.players.forEach(player => {
        if (player.ships) {
          const startGameResponse = createStartGameResponse(player.ships, player.index);
          sendToUser(player.index, startGameResponse, wss);
        }
      });

      const firstPlayer = gameSession.players.find(
        player => player.index === gameSession.currentPlayerIndex
      );
      if (firstPlayer) {
        const turnResponse = createTurnResponse(firstPlayer.idPlayer);
        gameSession.players.forEach(player => {
          sendToUser(player.index, turnResponse, wss);
        });
      }
    }
  }
};
