import { join } from 'node:path';
import { DBOnlineUsers, DBRooms, DBWinner } from '../types/DB';
import { readFile } from 'node:fs/promises';
import { SERVER_CONFIG } from '../constants/server';

export const readDB = async (
  fileName: string
): Promise<DBOnlineUsers[] | DBRooms[] | DBWinner[]> => {
  const DB_PATH = join(process.cwd(), `${SERVER_CONFIG.DB_PATH_PREFIX}/${fileName}.json`);
  try {
    const data = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};
