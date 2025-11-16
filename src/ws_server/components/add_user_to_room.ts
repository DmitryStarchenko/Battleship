import { readDB } from '../utils/readDB';
import { writeDB } from '../utils/writeDB';
import { DBRooms, DBOnlineUsers } from '../types/DB';
import { IResponse } from '../types/typesRes';
import { IAddUser } from '../types/typesReq';
import { DB_FILES } from '../constants/database';
import { RESPONSE_CONFIG } from '../constants/response';
import { GAME_CONFIG } from '../constants/game';

export const addUserToRoom = async (data: IAddUser, userIndex: number): Promise<IResponse> => {
  const rooms = (await readDB(DB_FILES.ROOMS)) as DBRooms[];
  const users = (await readDB(DB_FILES.ONLINE_USERS)) as DBOnlineUsers[];

  const user = users.find(elem => elem.index === userIndex);

  const targetRoomId = Number(data.indexRoom);
  const targetRoom = rooms.find(room => room.roomId === targetRoomId);

  const currentRoom = rooms.find(room =>
    room.roomUsers.some(roomUser => roomUser.index === userIndex)
  );

  if (currentRoom && currentRoom.roomId !== targetRoomId) {
    currentRoom.roomUsers = currentRoom.roomUsers.filter(roomUser => roomUser.index !== userIndex);

    if (currentRoom.roomUsers.length === GAME_CONFIG.EMPTY_ROOM) {
      const roomIndex = rooms.findIndex(room => room.roomId === currentRoom.roomId);
      if (roomIndex !== -1) {
        rooms.splice(roomIndex, 1);
      }
    }
  }

  if (targetRoom && user) {
    const userAlreadyInTargetRoom = targetRoom.roomUsers.some(
      roomUser => roomUser.index === userIndex
    );

    if (!userAlreadyInTargetRoom) {
      targetRoom.roomUsers.push({
        name: user.name,
        index: user.index,
      });
    }
  }

  await writeDB(rooms, DB_FILES.ROOMS);

  return {
    type: 'add_user_to_room',
    data: JSON.stringify(targetRoom),
    id: RESPONSE_CONFIG.DEFAULT_ID,
  };
};
