import { addUserToRoom } from '../components/add_user_to_room';
import { updateRoom } from '../components/update_room';
import { createGameSession } from '../utils/gameStorage';
import { broadcast } from '../utils/broadcast';
import { sendToUser } from '../utils/sendToUser';
import { createGameResponse } from '../utils/responseFactory';
import { WebSocketServer } from 'ws';

import { GAME_CONFIG } from '../constants/game';

export const handleAddUserToRoom = async (
  data: string,
  userIndex: number,
  wss: WebSocketServer
): Promise<void> => {
  const response = await addUserToRoom(JSON.parse(data), userIndex);

  if (response && response.data) {
    const roomData = JSON.parse(response.data as string);

    if (
      roomData &&
      roomData.roomUsers &&
      roomData.roomUsers.length === GAME_CONFIG.PLAYERS_PER_GAME
    ) {
      const playerIndexes = roomData.roomUsers.map((user: { index: number }) => user.index);
      const gameSession = createGameSession(roomData.roomId, playerIndexes);

      playerIndexes.forEach((playerIndex: number) => {
        const player = gameSession.players.find(player => player.index === playerIndex);
        if (player) {
          const gameResponse = createGameResponse(gameSession.idGame, player.idPlayer);
          sendToUser(playerIndex, gameResponse, wss);
        }
      });
    }

    const updateRoomResponse = await updateRoom();
    broadcast(updateRoomResponse, wss);
  }
};
