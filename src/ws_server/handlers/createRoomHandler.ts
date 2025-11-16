import { createRoom } from '../components/create_room';
import { updateRoom } from '../components/update_room';
import { broadcast } from '../utils/broadcast';
import { WebSocketServer } from 'ws';

export const handleCreateRoom = async (userIndex: number, wss: WebSocketServer): Promise<void> => {
  await createRoom(userIndex);
  const updateRoomResponse = await updateRoom();
  broadcast(updateRoomResponse, wss);
};
