import { IAttack } from '../types/request';
import { IResponse } from '../types/response';
import {
  getGameSession,
  getOpponentShips,
  getPlayerHits,
  setCurrentPlayer,
  getOpponentPlayer,
  getPlayerByIdPlayer,
} from '../utils/gameStorage';
import {
  checkHit,
  checkAllShipsDestroyed,
  getShipPositions,
  getSurroundingCells,
} from '../utils/battleLogic';
import { createAttackResponse } from '../utils/responseFactory';

export const attack = (
  reqData: IAttack
): { responses: IResponse[]; isGameOver: boolean; winnerId?: number } | null => {
  const gameId = Number(reqData.gameId);
  const attackerIdPlayer = Number(reqData.indexPlayer);

  const game = getGameSession(gameId);
  if (!game) return null;

  const attacker = getPlayerByIdPlayer(gameId, attackerIdPlayer);
  if (!attacker) return null;

  const opponentIndex = getOpponentPlayer(gameId, attacker.index);
  if (!opponentIndex) return null;

  const opponentShips = getOpponentShips(gameId, attacker.index);
  if (!opponentShips) return null;

  const opponentHits = getPlayerHits(gameId, opponentIndex);
  if (!opponentHits) return null;

  const result = checkHit(reqData.x, reqData.y, opponentShips, opponentHits);

  if (result.status === 'miss') {
    setCurrentPlayer(gameId, opponentIndex);
  }

  const responses: IResponse[] = [];

  responses.push(
    createAttackResponse({ x: reqData.x, y: reqData.y }, attackerIdPlayer, result.status)
  );

  if (result.status === 'killed' && result.killedShip) {
    const shipPositions = getShipPositions(result.killedShip);
    const surroundingCells = getSurroundingCells(shipPositions);

    surroundingCells.forEach(cell => {
      opponentHits.add(`${cell.x},${cell.y}`);
      responses.push(createAttackResponse(cell, attackerIdPlayer, 'miss'));
    });
  }

  const isGameOver = checkAllShipsDestroyed(opponentShips, opponentHits);

  return {
    responses,
    isGameOver,
    winnerId: isGameOver ? attackerIdPlayer : undefined,
  };
};
