import { IResponse } from '../types/typesRes';
import { readDB } from '../utils/readDB';
import { writeDB } from '../utils/writeDB';
import { DB_FILES } from '../constants/database';
import { DBOnlineUsers, DBWinner } from '../types/DB';
import { RESPONSE_CONFIG } from '../constants/response';

export const updateWinners = async (winnerIndex: number): Promise<IResponse> => {
  const users = (await readDB(DB_FILES.ONLINE_USERS)) as DBOnlineUsers[];
  const winner = users.find(u => u.index === winnerIndex);

  if (!winner) {
    return {
      type: 'update_winners',
      data: JSON.stringify([]),
      id: RESPONSE_CONFIG.DEFAULT_ID,
    };
  }

  let winners: DBWinner[] = [];
  try {
    winners = (await readDB(DB_FILES.WINNERS)) as DBWinner[];
  } catch {
    winners = [];
  }

  const existingWinner = winners.find(w => w.name === winner.name);
  if (existingWinner) {
    existingWinner.wins += 1;
  } else {
    winners.push({
      name: winner.name,
      wins: 1,
    });
  }

  await writeDB(winners, DB_FILES.WINNERS);

  return {
    type: 'update_winners',
    data: JSON.stringify(winners),
    id: RESPONSE_CONFIG.DEFAULT_ID,
  };
};
