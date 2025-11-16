import { getAvailableCells } from './battleLogic';
import { getGameSession, getPlayerHits } from './gameStorage';
import { BOT_CONFIG } from '../constants/bot';
import { BotMoveResult } from '../types/bot';

export const makeBotMove = (gameId: number): BotMoveResult | null => {
  const gameSession = getGameSession(gameId);
  if (!gameSession) return null;

  const botPlayer = gameSession.players.find(p => p.index === BOT_CONFIG.INDEX);
  if (!botPlayer) return null;

  const humanPlayer = gameSession.players.find(p => p.index !== BOT_CONFIG.INDEX);
  if (!humanPlayer) return null;

  const humanHits = getPlayerHits(gameId, humanPlayer.index);
  if (!humanHits) return null;

  const availableCells = getAvailableCells(humanHits);
  if (availableCells.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableCells.length);
  const cell = availableCells[randomIndex];

  return {
    x: cell.x,
    y: cell.y,
    botIdPlayer: botPlayer.idPlayer,
  };
};

export const isBotTurn = (gameId: number): boolean => {
  const gameSession = getGameSession(gameId);
  if (!gameSession) return false;

  return gameSession.currentPlayerIndex === BOT_CONFIG.INDEX;
};
