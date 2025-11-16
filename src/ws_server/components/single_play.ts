import { IResponse } from '../types/typesRes';
import { createGameSession, addShipsToGame } from '../utils/gameStorage';
import { generateRandomId } from '../utils/generateId';
import { generateBotShips } from '../utils/botShips';
import { BOT_CONFIG } from '../constants/bot';
import { RESPONSE_CONFIG } from '../constants/response';

export const singlePlay = (userIndex: number): { response: IResponse } => {
  const gameSession = createGameSession(generateRandomId(), [userIndex, BOT_CONFIG.INDEX]);

  const botShips = generateBotShips();
  addShipsToGame(gameSession.idGame, BOT_CONFIG.INDEX, botShips);

  const player = gameSession.players.find(player => player.index === userIndex);

  if (!player) {
    throw new Error('Player not found in game session');
  }

  return {
    response: {
      type: 'create_game',
      data: JSON.stringify({
        idGame: gameSession.idGame,
        idPlayer: player.idPlayer,
      }),
      id: RESPONSE_CONFIG.DEFAULT_ID,
    },
  };
};
