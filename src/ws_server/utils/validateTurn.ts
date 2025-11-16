import { getGameSession, getPlayerByIdPlayer } from './gameStorage';

export const validatePlayerTurn = (gameId: number, attackerIdPlayer: number): boolean => {
  const gameSession = getGameSession(gameId);
  if (!gameSession) return false;

  const attacker = getPlayerByIdPlayer(gameId, attackerIdPlayer);
  if (!attacker) return false;

  return attacker.index === gameSession.currentPlayerIndex;
};
