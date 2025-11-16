import { writeFile } from 'node:fs/promises';
import { DBRegUsers, DBRooms, DBWinner } from '../types/DB';
import { join } from 'node:path';
import { IUpdateRoom } from '../types/typesRes';
import { SERVER_CONFIG } from '../constants/server';

export const writeDB = async (
  dataDB: DBRegUsers[] | DBRooms[] | IUpdateRoom[] | DBWinner[],
  fileName: string
): Promise<void> => {
  const DB_PATH = join(process.cwd(), `${SERVER_CONFIG.DB_PATH_PREFIX}/${fileName}.json`);
  await writeFile(DB_PATH, JSON.stringify(dataDB, null, SERVER_CONFIG.JSON_INDENT), 'utf-8');
};
