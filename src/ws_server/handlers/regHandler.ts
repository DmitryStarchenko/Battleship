import { reg } from '../components/reg';
import { updateRoom } from '../components/update_room';
import { getWinners } from '../components/get_winners';
import { ExtendedWebSocket } from '../types/websocket';

export const handleReg = async (data: string, ws: ExtendedWebSocket): Promise<void> => {
  const response = await reg(JSON.parse(data));

  if (response && typeof response.data === 'string') {
    const regData = JSON.parse(response.data);
    if (!regData.error && regData.index) {
      ws.userIndex = regData.index;
    }

    ws.send(JSON.stringify(response));

    const updateRoomResponse = await updateRoom();
    ws.send(JSON.stringify(updateRoomResponse));

    const winnersResponse = await getWinners();
    ws.send(JSON.stringify(winnersResponse));
  }
};
