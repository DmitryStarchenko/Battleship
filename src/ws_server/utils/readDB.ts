import { join } from 'node:path';
import { DBOnlineUsers, DBRooms } from '../types/DB';
import { readFile } from 'node:fs/promises';

export const readDB = async (fileName: string): Promise<DBOnlineUsers[] | DBRooms[]> => {
  const DB_PATH = join(process.cwd(), `src/DataBase/${fileName}.json`);
  try {
    const data = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};
