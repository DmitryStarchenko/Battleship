import { IRandomAttack } from '../types/request';
import { IResponse } from '../types/response';
import { getGameSession, getOpponentPlayer, getPlayerHits } from '../utils/gameStorage';
import { getAvailableCells } from '../utils/battleLogic';
import { attack } from './attack';

export const randomAttack = (
  reqData: IRandomAttack
): { responses: IResponse[]; isGameOver: boolean; winnerId?: number } | null => {
  const gameId = Number(reqData.gameId);
  const attackerIdPlayer = Number(reqData.indexPlayer);

  const game = getGameSession(gameId);
  if (!game) return null;

  const attacker = game.players.find(p => p.idPlayer === attackerIdPlayer);
  if (!attacker) return null;

  const opponentIndex = getOpponentPlayer(gameId, attacker.index);
  if (!opponentIndex) return null;

  const opponentHits = getPlayerHits(gameId, opponentIndex);
  if (!opponentHits) return null;

  const availableCells = getAvailableCells(opponentHits);
  if (availableCells.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const randomCell = availableCells[randomIndex];

  return attack({
    gameId: reqData.gameId,
    x: randomCell.x,
    y: randomCell.y,
    indexPlayer: reqData.indexPlayer,
  });
};
