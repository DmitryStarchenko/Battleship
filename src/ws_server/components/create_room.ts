import { readDB } from '../utils/readDB';
import { writeDB } from '../utils/writeDB';

const FILE_NAME_REG_USERS = 'Online_users';
const FILE_NAME_ROOM = 'Room';

export const createRoom = async () => {
  const regUsers = await readDB(FILE_NAME_REG_USERS);
  let room;
  for (const user of regUsers) {
    room = [
      {
        roomId: Math.floor(Math.random() * 9999),
        roomUsers: [
          {
            name: user.name,
            index: user.index,
          },
        ],
      },
    ];
  }
  if (room) await writeDB(room, FILE_NAME_ROOM);
  return {
    type: 'update_room',
    data: JSON.stringify(room),
    id: 0,
  };
};
