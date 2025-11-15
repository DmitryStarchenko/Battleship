import { IRegReq } from '../types/typesReq';
import { IResponse } from '../types/typesRes';
import { DBRegUsers } from '../types/DB';
import { writeDB } from '../utils/writeDB';
import { readDB } from '../utils/readDB';

const FILE_NAME = 'Online_users';

export const reg = async (data: IRegReq): Promise<IResponse> => {
  const onlineUsers = await readDB(FILE_NAME);
  const existingUser = onlineUsers.find(({ name }) => name === data.name);

  if (existingUser) {
    return {
      type: 'reg',
      data: JSON.stringify({
        name: existingUser.name,
        index: existingUser.index,
        error: true,
        errorText: 'This user already exists',
      }),
      id: 0,
    };
  }

  const index = generateUniqueIndex(onlineUsers);
  const responsePayload = {
    name: data.name,
    index,
    error: false,
    errorText: '',
  };

  onlineUsers.push({
    name: responsePayload.name,
    password: data.password,
    index: responsePayload.index,
  });

  await writeDB(onlineUsers, FILE_NAME);

  return {
    type: 'reg',
    data: JSON.stringify(responsePayload),
    id: 0,
  };
};

const generateUniqueIndex = (regUsers: DBRegUsers[]): number => {
  const existingIndexes = new Set(regUsers.map(({ index }) => index));
  let index = Math.floor(Math.random() * 1_000_000);

  while (existingIndexes.has(index)) {
    index = Math.floor(Math.random() * 1_000_000);
  }

  return index;
};
