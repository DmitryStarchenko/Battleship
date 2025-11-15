import { IAddShips } from '../types/typesReq';
import { IStartGame } from '../types/typesRes';

export const startGame = (reqData: IAddShips) => {
  const game: IStartGame = {
    ships: reqData.ships,
    currentPlayerIndex: reqData.indexPlayer,
  };

  return {
    type: 'start_game',
    data: JSON.stringify(game),
    id: 0,
  };
};
