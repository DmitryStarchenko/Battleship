import { readDB } from '../utils/readDB';
import { DBRooms } from '../types/DB';
import { IUpdateRoom, IResponse } from '../types/response';
import { DB_FILES } from '../constants/database';
import { GAME_CONFIG } from '../constants/game';
import { RESPONSE_CONFIG } from '../constants/response';

export const updateRoom = async (): Promise<IResponse> => {
  const rooms = (await readDB(DB_FILES.ROOMS)) as DBRooms[];

  const singleUserRooms: IUpdateRoom[] = rooms
    .filter(room => room.roomUsers.length === GAME_CONFIG.SINGLE_PLAYER_ROOM)
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
    id: RESPONSE_CONFIG.DEFAULT_ID,
  };
};
