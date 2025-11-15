import { readDB } from './readDB';
import { writeDB } from './writeDB';
import { DBOnlineUsers, DBRooms } from '../types/DB';
import { DB_FILES } from '../constants/database';

export const userLogout = async (userIndex: number): Promise<void> => {
  const onlineUsers = (await readDB(DB_FILES.ONLINE_USERS)) as DBOnlineUsers[];
  const filteredUsers = onlineUsers.filter(user => user.index !== userIndex);
  await writeDB(filteredUsers, DB_FILES.ONLINE_USERS);

  const rooms = (await readDB(DB_FILES.ROOMS)) as DBRooms[];
  const updatedRooms = rooms.filter(room => {
    if (room.roomUsers.length === 1 && room.roomUsers[0].index === userIndex) {
      return false;
    }
    return true;
  });
  await writeDB(updatedRooms, DB_FILES.ROOMS);
};
