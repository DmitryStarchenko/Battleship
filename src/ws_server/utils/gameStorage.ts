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
      hits: new Set<string>(),
    })),
    currentPlayerIndex: playerIndexes[0],
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

  const player = game.players.find(player => player.index === playerIndex);
  if (!player) return false;

  player.ships = ships;
  return true;
};

export const bothPlayersReady = (idGame: number): boolean => {
  const game = gameSessions.get(idGame);
  if (!game) return false;

  return game.players.every(player => player.ships !== undefined);
};

export const getPlayerIdInGame = (idGame: number, playerIndex: number): number | undefined => {
  const game = gameSessions.get(idGame);
  if (!game) return undefined;

  const player = game.players.find(player => player.index === playerIndex);
  return player?.idPlayer;
};

export const getCurrentPlayer = (idGame: number): number | undefined => {
  const game = gameSessions.get(idGame);
  return game?.currentPlayerIndex;
};

export const setCurrentPlayer = (idGame: number, playerIndex: number): void => {
  const game = gameSessions.get(idGame);
  if (game) {
    game.currentPlayerIndex = playerIndex;
  }
};

export const getOpponentPlayer = (idGame: number, playerIndex: number): number | undefined => {
  const game = gameSessions.get(idGame);
  if (!game) return undefined;

  const opponent = game.players.find(player => player.index !== playerIndex);
  return opponent?.index;
};

export const getOpponentShips = (idGame: number, playerIndex: number): IShips[] | undefined => {
  const game = gameSessions.get(idGame);
  if (!game) return undefined;

  const opponent = game.players.find(player => player.index !== playerIndex);
  return opponent?.ships;
};

export const getPlayerByIdPlayer = (
  idGame: number,
  idPlayer: number
): { index: number; idPlayer: number } | undefined => {
  const game = gameSessions.get(idGame);
  if (!game) return undefined;

  const player = game.players.find(player => player.idPlayer === idPlayer);
  if (!player) return undefined;

  return { index: player.index, idPlayer: player.idPlayer };
};

export const getPlayerHits = (idGame: number, playerIndex: number): Set<string> | undefined => {
  const game = gameSessions.get(idGame);
  if (!game) return undefined;

  const player = game.players.find(player => player.index === playerIndex);
  return player?.hits;
};
