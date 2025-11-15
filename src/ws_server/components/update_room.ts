import { readDB } from '../utils/readDB';
import { DBRooms } from '../types/DB';
import { IUpdateRoom, IResponse } from '../types/typesRes';
import { DB_FILES } from '../constants/database';

export const updateRoom = async (): Promise<IResponse> => {
  const rooms = (await readDB(DB_FILES.ROOMS)) as DBRooms[];

  const singleUserRooms: IUpdateRoom[] = rooms
    .filter(room => room.roomUsers.length === 1)
    .map(room => ({
      roomId: room.roomId,
      roomUsers: room.roomUsers.map(user => ({
        name: user.name,
        index: user.index,
      })),
    }));

  return {
    type: 'update_room',
    data: JSON.stringify(singleUserRooms),
    id: 0,
  };
};
