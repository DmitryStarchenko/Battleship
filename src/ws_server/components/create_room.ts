import { readDB } from '../utils/readDB';
import { writeDB } from '../utils/writeDB';
import { DBRooms, DBOnlineUsers } from '../types/DB';
import { DB_FILES } from '../constants/database';
import { generateRandomId } from '../utils/generateId';

export const createRoom = async (userIndex: number): Promise<void> => {
  const rooms = (await readDB(DB_FILES.ROOMS)) as DBRooms[];
  const users = (await readDB(DB_FILES.ONLINE_USERS)) as DBOnlineUsers[];

  const user = users.find(data => data.index === userIndex);

  const newRoom: DBRooms = {
    roomId: generateRandomId(9999),
    roomUsers: [
      {
        name: user ? user.name : '',
        index: user ? user.index : 0,
      },
    ],
  };

  rooms.push(newRoom);
  await writeDB(rooms, DB_FILES.ROOMS);
};
