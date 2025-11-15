import { ICreateGame } from '../types/typesRes';

export const createGame = () => {
  const game: ICreateGame = {
    idGame: Math.floor(Math.random() * 99),
    idPlayer: Math.floor(Math.random() * 9999),
  };

  return {
    type: 'create_game',
    data: JSON.stringify(game),
    id: 0,
  };
};
