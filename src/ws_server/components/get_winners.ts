import { IResponse } from '../types/typesRes';
import { readDB } from '../utils/readDB';
import { DBWinner } from '../types/DB';
import { DB_FILES } from '../constants/database';

export const getWinners = async (): Promise<IResponse> => {
  let winners: DBWinner[] = [];
  try {
    winners = (await readDB(DB_FILES.WINNERS)) as DBWinner[];
  } catch {
    winners = [];
  }

  return {
    type: 'update_winners',
    data: JSON.stringify(winners),
    id: 0,
  };
};
