import { IResponse } from '../types/typesRes';
import { IShips } from '../types/typesReq';

export const createResponse = <T>(type: string, data: T): IResponse => ({
  type,
  data: JSON.stringify(data),
  id: 0,
});

export const createAttackResponse = (
  position: { x: number; y: number },
  currentPlayer: number | string,
  status: 'miss' | 'shot' | 'killed'
): IResponse =>
  createResponse('attack', {
    position,
    currentPlayer,
    status,
  });

export const createTurnResponse = (currentPlayer: number | string): IResponse =>
  createResponse('turn', {
    currentPlayer,
  });

export const createFinishResponse = (winPlayer: number | string): IResponse =>
  createResponse('finish', {
    winPlayer,
  });

export const createGameResponse = (idGame: number | string, idPlayer: number | string): IResponse =>
  createResponse('create_game', {
    idGame,
    idPlayer,
  });

export const createStartGameResponse = (
  ships: IShips[],
  currentPlayerIndex: number | string
): IResponse =>
  createResponse('start_game', {
    ships,
    currentPlayerIndex,
  });
