import { readDB } from './readDB';
import { writeDB } from './writeDB';

export const userLogout = async (userIndex: number): Promise<void> => {
  const FILE_NAME = 'Online_users';
  const onlineUsers = await readDB(FILE_NAME);
  const filteredUsers = onlineUsers.filter(user => user.index !== userIndex);
  await writeDB(filteredUsers, FILE_NAME);
};
