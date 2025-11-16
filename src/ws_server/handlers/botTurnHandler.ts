import { attack } from '../components/attack';
import { makeBotMove, isBotTurn } from '../utils/botMove';
import { getGameSession } from '../utils/gameStorage';
import { sendToUser } from '../utils/sendToUser';
import { createTurnResponse } from '../utils/responseFactory';
import { updateWinners } from '../components/update_winners';
import { broadcast } from '../utils/broadcast';
import { WebSocketServer } from 'ws';
import { BOT_CONFIG } from '../constants/bot';
import { RESPONSE_CONFIG } from '../constants/response';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processBotTurns = async (gameId: number, wss: WebSocketServer): Promise<void> => {
  while (isBotTurn(gameId)) {
    await delay(BOT_CONFIG.TURN_DELAY_MS);

    const botMoveData = makeBotMove(gameId);
    if (!botMoveData) break;

    const result = attack({
      gameId: gameId.toString(),
      x: botMoveData.x,
      y: botMoveData.y,
      indexPlayer: botMoveData.botIdPlayer.toString(),
    });

    if (!result) break;

    const gameSession = getGameSession(gameId);
    if (!gameSession) break;

    const humanPlayer = gameSession.players.find(player => player.index !== BOT_CONFIG.INDEX);
    if (!humanPlayer) break;

    result.responses.forEach(attackResponse => {
      sendToUser(humanPlayer.index, attackResponse, wss);
    });

    if (result.isGameOver && result.winnerId) {
      const winner = gameSession.players.find(player => player.idPlayer === result.winnerId);

      if (winner) {
        sendToUser(
          humanPlayer.index,
          {
            type: 'finish',
            data: JSON.stringify({
              winPlayer: result.winnerId,
            }),
            id: RESPONSE_CONFIG.DEFAULT_ID,
          },
          wss
        );

        if (winner.index !== BOT_CONFIG.INDEX) {
          const winnersResponse = await updateWinners(winner.index);
          broadcast(winnersResponse, wss);
        }
      }
      break;
    }

    if (result.responses[0]) {
      const mainAttack = JSON.parse(result.responses[0].data as string);
      if (mainAttack.status === 'miss') {
        break;
      }
    }
  }

  if (!isBotTurn(gameId)) {
    const gameSession = getGameSession(gameId);
    if (gameSession) {
      const currentPlayer = gameSession.players.find(
        player => player.index === gameSession.currentPlayerIndex
      );
      const humanPlayer = gameSession.players.find(player => player.index !== BOT_CONFIG.INDEX);

      if (currentPlayer && humanPlayer) {
        const turnResponse = createTurnResponse(currentPlayer.idPlayer);
        sendToUser(humanPlayer.index, turnResponse, wss);
      }
    }
  }
};
