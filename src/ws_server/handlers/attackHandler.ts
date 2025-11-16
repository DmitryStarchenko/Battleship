import { IResponse } from '../types/typesRes';
import { getGameSession } from '../utils/gameStorage';
import { sendToUser } from '../utils/sendToUser';
import { broadcast } from '../utils/broadcast';
import { updateWinners } from '../components/update_winners';
import { createFinishResponse, createTurnResponse } from '../utils/responseFactory';
import { WebSocketServer } from 'ws';

export const handleAttackResult = async (
  result: { responses: IResponse[]; isGameOver: boolean; winnerId?: number } | null,
  gameId: number,
  wss: WebSocketServer
): Promise<void> => {
  if (!result) return;

  const gameSession = getGameSession(gameId);
  if (!gameSession) return;

  result.responses.forEach(attackResponse => {
    gameSession.players.forEach(player => {
      sendToUser(player.index, attackResponse, wss);
    });
  });

  if (result.isGameOver && result.winnerId) {
    const winner = gameSession.players.find(player => player.idPlayer === result.winnerId);

    if (winner) {
      const finishResponse = createFinishResponse(result.winnerId);
      gameSession.players.forEach(player => {
        sendToUser(player.index, finishResponse, wss);
      });

      const winnersResponse = await updateWinners(winner.index);
      broadcast(winnersResponse, wss);
    }
  } else {
    sendTurnToPlayers(gameSession, wss);
  }
};

const sendTurnToPlayers = (
  gameSession: { players: Array<{ index: number; idPlayer: number }>; currentPlayerIndex: number },
  wss: WebSocketServer
): void => {
  const currentPlayer = gameSession.players.find(
    player => player.index === gameSession.currentPlayerIndex
  );

  if (currentPlayer) {
    const turnResponse = createTurnResponse(currentPlayer.idPlayer);
    gameSession.players.forEach(player => {
      sendToUser(player.index, turnResponse, wss);
    });
  }
};
