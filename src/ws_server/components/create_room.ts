import { readDB } from '../utils/readDB';
import { writeDB } from '../utils/writeDB';
import { DBRooms, DBOnlineUsers } from '../types/DB';
import { IResponse } from '../types/typesRes';
import { DB_FILES } from '../constants/database';
import { generateRandomId } from '../utils/generateId';

export const createRoom = async (userIndex: number): Promise<IResponse> => {
  const rooms = (await readDB(DB_FILES.ROOMS)) as DBRooms[];
  const users = (await readDB(DB_FILES.ONLINE_USERS)) as DBOnlineUsers[];

  const user = users.find(data => data.index === userIndex);

  if (!user) {
    return {
      type: 'create_room',
      data: JSON.stringify({ error: true, errorText: 'User not found' }),
      id: 0,
    };
  }

  const userInRoom = rooms.some(room =>
    room.roomUsers.some(roomUser => roomUser.index === userIndex)
  );

  if (userInRoom) {
    return {
      type: 'create_room',
      data: JSON.stringify({ error: true, errorText: 'User already in a room' }),
      id: 0,
    };
  }

  const newRoom: DBRooms = {
    roomId: generateRandomId(9999),
    roomUsers: [
      {
        name: user.name,
        index: user.index,
      },
    ],
  };

  rooms.push(newRoom);
  await writeDB(rooms, DB_FILES.ROOMS);

  return {
    type: 'create_room',
    data: '',
    id: 0,
  };
};
