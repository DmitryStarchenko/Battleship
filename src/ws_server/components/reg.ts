import { join } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { IRegReq } from '../types/typesReq';
import { IResponse } from '../types/typesRes';
import { DB } from '../types/DB';

export const reg = async (data: IRegReq): Promise<IResponse> => {
  const dataDB = await readDB();
  const existingUser = dataDB.find(({ name }) => name === data.name);

  if (existingUser) {
    const isPasswordValid = existingUser.password === data.password;
    return {
      type: 'reg',
      data: JSON.stringify({
        name: existingUser.name,
        index: existingUser.index,
        error: !isPasswordValid,
        errorText: isPasswordValid
          ? ''
          : 'This user already exists, please enter the correct password.',
      }),
      id: 0,
    };
  }

  const index = generateUniqueIndex(dataDB);
  const responsePayload = {
    name: data.name,
    index,
    error: false,
    errorText: '',
  };

  dataDB.push({
    name: responsePayload.name,
    password: data.password,
    index: responsePayload.index,
  });

  await writeDB(dataDB);

  return {
    type: 'reg',
    data: JSON.stringify(responsePayload),
    id: 0,
  };
};

const DB_PATH = join(process.cwd(), 'src/DB.json');

const readDB = async (): Promise<DB[]> => {
  try {
    const data = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeDB = async (dataDB: DB[]) => {
  await writeFile(DB_PATH, JSON.stringify(dataDB, null, 2), 'utf-8');
};

const generateUniqueIndex = (dataDB: DB[]): number => {
  const existingIndexes = new Set(dataDB.map(({ index }) => index));
  let index = Math.floor(Math.random() * 1_000_000);

  while (existingIndexes.has(index)) {
    index = Math.floor(Math.random() * 1_000_000);
  }

  return index;
};
