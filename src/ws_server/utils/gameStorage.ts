import { IShips } from '../types/typesReq';
import { GameSession } from '../types/game';
import { generateRandomId } from './generateId';

const gameSessions: Map<number, GameSession> = new Map();

export const createGameSession = (roomId: number, playerIndexes: number[]): GameSession => {
  const idGame = generateRandomId();
  const gameSession: GameSession = {
    idGame,
    roomId,
    players: playerIndexes.map(index => ({
      index,
      idPlayer: generateRandomId(),
      ships: undefined,
    })),
  };
  gameSessions.set(idGame, gameSession);
  return gameSession;
};

export const getGameSession = (idGame: number): GameSession | undefined => {
  return gameSessions.get(idGame);
};

export const addShipsToGame = (idGame: number, playerIndex: number, ships: IShips[]): boolean => {
  const game = gameSessions.get(idGame);
  if (!game) return false;

  const player = game.players.find(p => p.index === playerIndex);
  if (!player) return false;

  player.ships = ships;
  return true;
};

export const bothPlayersReady = (idGame: number): boolean => {
  const game = gameSessions.get(idGame);
  if (!game) return false;

  return game.players.every(p => p.ships !== undefined);
};

export const getPlayerIdInGame = (idGame: number, playerIndex: number): number | undefined => {
  const game = gameSessions.get(idGame);
  if (!game) return undefined;

  const player = game.players.find(p => p.index === playerIndex);
  return player?.idPlayer;
};
