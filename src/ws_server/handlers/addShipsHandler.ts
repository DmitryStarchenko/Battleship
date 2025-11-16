import { IAddShips } from '../types/request';
import { addShipsToGame, bothPlayersReady, getGameSession } from '../utils/gameStorage';
import { sendToUser } from '../utils/sendToUser';
import { createStartGameResponse, createTurnResponse } from '../utils/responseFactory';
import { processBotTurns } from './botTurnHandler';
import { WebSocketServer } from 'ws';
import { BOT_CONFIG } from '../constants/bot';

export const handleAddShips = async (
  data: string,
  userIndex: number,
  wss: WebSocketServer
): Promise<void> => {
  const shipsData = JSON.parse(data) as IAddShips;
  const gameId = Number(shipsData.gameId);

  addShipsToGame(gameId, userIndex, shipsData.ships);

  const gameSession = getGameSession(gameId);
  if (!gameSession) return;

  const isGameWithBot = gameSession.players.some(player => player.index === BOT_CONFIG.INDEX);

  if (isGameWithBot) {
    const player = gameSession.players.find(player => player.index === userIndex);
    if (player && player.ships) {
      const startGameResponse = createStartGameResponse(player.ships, player.index);
      sendToUser(player.index, startGameResponse, wss);

      const firstPlayer = gameSession.players.find(
        player => player.index === gameSession.currentPlayerIndex
      );
      if (firstPlayer) {
        const turnResponse = createTurnResponse(firstPlayer.idPlayer);
        sendToUser(player.index, turnResponse, wss);

        if (firstPlayer.index === BOT_CONFIG.INDEX) {
          await processBotTurns(gameId, wss);
        }
      }
    }
  } else {
    if (bothPlayersReady(gameId)) {
      const updatedGameSession = getGameSession(gameId);
      if (updatedGameSession) {
        updatedGameSession.players.forEach(player => {
          if (player.ships) {
            const startGameResponse = createStartGameResponse(player.ships, player.index);
            sendToUser(player.index, startGameResponse, wss);
          }
        });

        const firstPlayer = updatedGameSession.players.find(
          player => player.index === updatedGameSession.currentPlayerIndex
        );
        if (firstPlayer) {
          const turnResponse = createTurnResponse(firstPlayer.idPlayer);
          updatedGameSession.players.forEach(player => {
            sendToUser(player.index, turnResponse, wss);
          });
        }
      }
    }
  }
};
