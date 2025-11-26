import { IRegReq } from '../types/request';
import { IResponse } from '../types/response';
import { DBRegUsers } from '../types/DB';
import { writeDB } from '../utils/writeDB';
import { readDB } from '../utils/readDB';
import { DB_FILES } from '../constants/database';
import { generateUniqueId } from '../utils/generateId';
import { RESPONSE_CONFIG } from '../constants/response';

export const reg = async (data: IRegReq): Promise<IResponse> => {
  const onlineUsers = (await readDB(DB_FILES.ONLINE_USERS)) as DBRegUsers[];
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
      id: RESPONSE_CONFIG.DEFAULT_ID,
    };
  }

  const existingIndexes = new Set(onlineUsers.map(({ index }) => index));
  const index = generateUniqueId(existingIndexes);

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

  await writeDB(onlineUsers, DB_FILES.ONLINE_USERS);

  return {
    type: 'reg',
    data: JSON.stringify(responsePayload),
    id: RESPONSE_CONFIG.DEFAULT_ID,
  };
};
