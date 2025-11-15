import { writeFile } from 'node:fs/promises';
import { DBRegUsers, DBRooms } from '../types/DB';
import { join } from 'node:path';
import { IUpdateRoom } from '../types/typesRes';

export const writeDB = async (
  dataDB: DBRegUsers[] | DBRooms[] | IUpdateRoom[],
  fileName: string
): Promise<void> => {
  const DB_PATH = join(process.cwd(), `src/DataBase/${fileName}.json`);
  await writeFile(DB_PATH, JSON.stringify(dataDB, null, 2), 'utf-8');
};
