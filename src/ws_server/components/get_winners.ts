import { IResponse } from '../types/typesRes';
import { readDB } from '../utils/readDB';
import { DBWinner } from '../types/DB';
import { DB_FILES } from '../constants/database';
import { RESPONSE_CONFIG } from '../constants/response';

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
    id: RESPONSE_CONFIG.DEFAULT_ID,
  };
};
